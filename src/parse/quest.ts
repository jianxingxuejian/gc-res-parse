import fs from 'fs-extra'
import { readDir, readJson, textMap } from '@/utils'

type QuestData = {
    id: number
    type: QuestType
    showType: string
    subQuests?: QuestChildren[]
    titleTextMapHash: number
    descTextMapHash?: number
    luaPath: string
}

type QuestInfo = {
    value: number
    type: QuestType
    hidden?: true
    test?: true
    unreleased?: true
    titleTextMapHash: number
    descTextMapHash?: number
    children?: {
        value: number
        order: number
        hidden?: true
        test?: true
        unreleased?: true
        descTextMapHash?: number
    }
}

type QuestType = 'WQ' | 'IQ' | 'LQ'

const replaceArr = [
    '$HIDDEN',
    '$Hidden',
    '【隐藏】',
    '（隐藏）',
    '(隐藏)',
    '(TEST)',
    '(test)',
    '（test）',
    '(test）',
    '（test)',
    'test',
    '$UNRELEASED'
]

export function parseQuest() {
    const fileName = 'BinOutput/Quest/'
    const nameList = readDir(fileName)
    const questInfoArray: QuestInfo[] = []

    nameList.forEach(item => {
        const read = readJson<QuestData>(fileName + item)
        if (read) {
            const {
                id,
                type,
                showType,
                subQuests,
                titleTextMapHash,
                descTextMapHash
            } = read
        }
    })

    // Object.entries(textMap).forEach(([locale,textMap])=>{

    // })
}
