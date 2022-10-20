import { groupBy } from 'lodash-es'
import { readJson, parse } from '@/utils'

interface MonsterExcelConfigData extends JsonObject {
    id: number
    monsterName: string
    type: MonsterType
    ai: string
}

type MonsterType =
    | 'MONSTER_ORDINARY'
    | 'MONSTER_BOSS'
    | 'MONSTER_ENV_ANIMAL'
    | 'MONSTER_FISH'
    | 'MONSTER_PARTNER'

const file_item = 'monsterItem.json'

export function parseMonster() {
    const monsterData = readJson<MonsterExcelConfigData[]>(
        'ExcelBinOutput/MonsterExcelConfigData.json'
    )
    if (!monsterData) return

    const monsterItem: Record<MonsterType, Record<number, string>> = {
        MONSTER_ORDINARY: {},
        MONSTER_BOSS: {},
        MONSTER_ENV_ANIMAL: {},
        MONSTER_FISH: {},
        MONSTER_PARTNER: {}
    }
    Object.entries(
        groupBy(
            monsterData.sort((a, b) => a.id - b.id),
            'type'
        )
    ).forEach(([k, v]) =>
        v.forEach(
            ({ id, monsterName }) =>
                (monsterItem[k as MonsterType][id] = monsterName)
        )
    )

    parse(file_item, monsterItem)
}
