import { groupBy } from 'lodash-es'
import { readJson, replaceToBlank, includesArray, textMap, parse } from '@/utils'

interface QuestExcelConfigData extends JsonObject {
    mainId: number | null
    subId: number
    order: number
    showType: string
    descTextMapHash?: number
}

type QuestInfo = {
    id: number
    titleHash: number
    hidden?: true
    test?: true
    unreleased?: true
    children?: { subId: number; order: number; descHash?: number; hidden?: true; test?: true; unreleased?: true }[]
}

interface QuestData {
    id: number
    titleTextMapHash: number
    showType: string
}

export function parseQuest() {
    const questData = readJson<QuestExcelConfigData[]>('ExcelBinOutput/QuestExcelConfigData.json')
    if (!questData) return

    const questInfos: QuestInfo[] = []
    const textMapCHS = textMap['zh-CN']
    const questItem_CHS: Record<string, string> = {}
    const group = groupBy(questData, 'mainId')
    Object.entries(group).forEach(([k, v]) => {
        if (k !== 'null') {
            const name = `BinOutput/Quest/${k}.json`
            const read = readJson<QuestData>(name)
            if (!read) return true

            const { id, titleTextMapHash, showType } = read
            const text = (titleTextMapHash && textMapCHS[titleTextMapHash]) || ''
            const { hidden, test, unreleased, newText } = parseText(text, showType)
            newText && (questItem_CHS[titleTextMapHash] = newText)
            const questInfo = {
                id,
                hidden,
                test,
                unreleased,
                titleHash: titleTextMapHash,
                children: v
                    .sort((a, b) => a.order - b.order)
                    .map(({ subId, order, descTextMapHash, showType }) => {
                        const text = (descTextMapHash && textMapCHS[descTextMapHash]) || ''
                        const { hidden, test, unreleased, newText } = parseText(text, showType)
                        if (descTextMapHash && newText) {
                            questItem_CHS[descTextMapHash] = newText
                        } else {
                            descTextMapHash = undefined
                        }
                        return { subId, order, hidden, test, unreleased, descHash: descTextMapHash }
                    })
            }
            questInfos.push(questInfo)
        } else {
            v.forEach(({ subId, descTextMapHash, showType }) => {
                const text = (descTextMapHash && textMapCHS[descTextMapHash]) || ''
                const { hidden, test, unreleased, newText } = parseText(text, showType)
                if (descTextMapHash && newText) {
                    questInfos.push({ id: subId, hidden, test, unreleased, titleHash: descTextMapHash })
                    questItem_CHS[descTextMapHash] = newText
                }
            })
        }
    })

    parse('questInfo.json', questInfos)
    parse('zh-CN/questItem.json', questItem_CHS)

    Object.keys(textMap).forEach(locale => {
        if (locale !== 'zh-CN') {
            const questItem: Record<string, string> = {}
            Object.keys(questItem_CHS).forEach(item => {
                const text = textMap[locale][item]
                text && (questItem[item] = text)
            })
            parse(locale + '/questItem.json', questItem)
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
