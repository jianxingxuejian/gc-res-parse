import { groupBy } from 'lodash-es'
import { readJson, parse } from '@/utils'

interface MonsterExcelConfigData extends JsonObject {
    id: number
    monsterName: string
    type: string
    ai: string
}

export function parseMonster() {
    const monsterData = readJson<MonsterExcelConfigData[]>('ExcelBinOutput/MonsterExcelConfigData.json')
    if (!monsterData) return

    const monsterItem: Record<string, Record<string, string>> = {}
    Object.entries(
        groupBy(
            monsterData.sort((a, b) => a.id - b.id),
            'type'
        )
    ).forEach(([k, v]) => {
        monsterItem[k] = {}
        v.forEach(({ id, monsterName }) => (monsterItem[k][id] = monsterName))
    })

    parse('monsterItem.json', monsterItem)
}
