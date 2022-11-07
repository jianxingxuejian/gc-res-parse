import { readDir, readJson, replaceToBlank, includesArray, textMap, parse } from '@/utils'

interface QuestData {
    id: number
    type: string
    showType: string
    subQuests?: { subId: number; order: number; showType: string; descTextMapHash?: number }[]
    titleTextMapHash?: number
    descTextMapHash?: number
}

type Quest = {
    id: number
    type: string
    hidden?: true
    test?: true
    unreleased?: true
    titleHash?: number
    descHash?: number
    children?: {
        subId: number
        order: number
        hidden?: true
        test?: true
        unreleased?: true
        descHash?: number
    }[]
}

export function parseQuest() {
    const fileName = 'BinOutput/Quest/'
    const nameList = readDir(fileName)
    const questArray: Quest[] = []
    const questItem_CHS: Record<string, string> = {}

    const textMapCHS = textMap['zh-CN']

    nameList.forEach(item => {
        const read = readJson<QuestData>(fileName + item)
        if (!read) return true

        const { id, type, showType, subQuests, titleTextMapHash, descTextMapHash } = read

        const text = (titleTextMapHash && textMapCHS[titleTextMapHash]) || ''

        let desc = descTextMapHash && textMapCHS[descTextMapHash]
        if (text === desc) {
            desc = undefined
        } else {
            desc = replaceToBlank(desc, hiddenStrs.concat(testStrs).concat('QUEST_HIDDEN'))
            descTextMapHash && desc && (questItem_CHS[descTextMapHash] = desc)
        }

        const { hidden, test, unreleased, newText } = parseText(text, showType)

        titleTextMapHash && newText && (questItem_CHS[titleTextMapHash] = newText)

        const quest: Quest = {
            id,
            type,
            hidden,
            test,
            unreleased,
            titleHash: titleTextMapHash,
            descHash: descTextMapHash,
            children:
                subQuests &&
                subQuests
                    .sort((a, b) => a.order - b.order)
                    .map(({ subId, descTextMapHash, order, showType }) => {
                        const text = (descTextMapHash && textMapCHS[descTextMapHash]) || ''
                        const { hidden, test, unreleased, newText } = parseText(text, showType)
                        if (descTextMapHash && newText) {
                            questItem_CHS[descTextMapHash] = newText
                        }
                        return { subId, order, hidden, test, unreleased, descHash: descTextMapHash }
                    })
        }
        questArray.push(quest)
    })

    questArray.sort((a, b) => a.id - b.id)
    parse('quest.json', questArray)

    parse('zh-CN/questItem.json', questItem_CHS)

    Object.keys(textMap).forEach(key => {
        if (key !== 'zh-CN') {
            const questItem: Record<string, string> = {}
            Object.keys(questItem_CHS).forEach(item => {
                const text = textMap[key][item]
                text && (questItem[item] = text)
            })
            parse(key + '/questItem.json', questItem)
        }
    })
}

const hiddenStrs = ['$HIDDEN', '$Hidden', '【隐藏】', '（隐藏）', '(隐藏)']
const testStrs = ['(TEST)', '(test)', '（test）', '(test）', '（test)', 'test']
function parseText(text: string | undefined, showType: string) {
    let hidden = showType === 'QUEST_HIDDEN' || undefined
    let test: true | undefined
    let unreleased: true | undefined

    if (text) {
        if (includesArray(text, hiddenStrs)) {
            hidden = true
            text = replaceToBlank(text, hiddenStrs)
        }
        if (includesArray(text, testStrs)) {
            test = true
            text = replaceToBlank(text, testStrs)
        }
        if (text.includes('$UNRELEASED')) {
            text = text.replace('$UNRELEASED', '')
            unreleased = true
        }
        text = text.trim()
    }

    return { hidden, test, unreleased, newText: text }
}
