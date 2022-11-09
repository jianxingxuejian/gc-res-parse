import { groupBy } from 'lodash-es'
import { readJson, parse, textMap } from '@/utils'

interface MonsterExcelConfigData extends JsonObject {
    id: number
    monsterName: string
    type: string
    nameTextMapHash: number
    describeId?: number
    descNameHash?: number
    specialNameHash?: number
}

interface MonsterDescribeExcelConfigData extends JsonObject {
    id: number
    nameTextMapHash: number
    titleID: number
    specialNameLabID: number
}

export function parseMonster() {
    const monsterData = readJson<MonsterExcelConfigData[]>('ExcelBinOutput/MonsterExcelConfigData.json')
    if (!monsterData) return

    const monsterDescData = readJson<MonsterDescribeExcelConfigData[]>(
        'ExcelBinOutput/MonsterDescribeExcelConfigData.json'
    )
    if (!monsterDescData) return

    monsterData.forEach(({ describeId }, index) => {
        if (!describeId) return

        const desc = monsterDescData.find(item => item.id === describeId)
        if (!desc) return

        monsterData[index].descNameHash = desc.nameTextMapHash
    })

    const group = groupBy(
        monsterData.sort((a, b) => a.id - b.id),
        'type'
    )

    Object.keys(textMap).forEach(locale => {
        const monsterItem: Record<string, Record<string, string>> = {}
        Object.entries(group).forEach(([k, v]) => {
            monsterItem[k] = {}
            v.forEach(({ id, nameTextMapHash, monsterName, descNameHash }) => {
                let name = textMap[locale][nameTextMapHash] || (descNameHash && textMap[locale][descNameHash])
                if (name) {
                    name += ` (${monsterName})`
                }
                monsterItem[k][id] = name || monsterName
            })
        })
        parse(locale + '/monsterItem.json', monsterItem)
    })
}
