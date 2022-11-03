import { groupBy } from 'lodash-es'
import { readJson, textMap, parse } from '@/utils'

interface WeaponExcelConfigData extends JsonObject {
    id: number
    weaponType: WeaponType
    // rankLevel: 1 | 2 | 3 | 4 | 5
    nameTextMapHash: number
}

type WeaponType = 'WEAPON_SWORD_ONE_HAND' | 'WEAPON_CLAYMORE' | 'WEAPON_POLE' | 'WEAPON_CATALYST' | 'WEAPON_BOW'

export function parseWeapon() {
    const weaponData = readJson<WeaponExcelConfigData[]>('ExcelBinOutput/WeaponExcelConfigData.json')
    if (!weaponData) return

    const weaponItem_CHS: Record<string, Record<string, string>> = {
        WEAPON_SWORD_ONE_HAND: {},
        WEAPON_CLAYMORE: {},
        WEAPON_POLE: {},
        WEAPON_CATALYST: {},
        WEAPON_BOW: {}
    }
    const weaponItem_EN = JSON.parse(JSON.stringify(weaponItem_CHS))

    Object.entries(groupBy(weaponData, 'weaponType')).forEach(([k, v]) =>
        v.forEach(({ id, nameTextMapHash }) => {
            weaponItem_CHS[k][id] = textMap['CHS'][nameTextMapHash]
            weaponItem_EN[k][id] = textMap['EN'][nameTextMapHash]
        })
    )

    parse('zh-CN/weaponItem.json', weaponItem_CHS)
    parse('en-US/weaponItem.json', weaponItem_EN)
}
