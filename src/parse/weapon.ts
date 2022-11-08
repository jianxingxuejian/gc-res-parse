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

    Object.keys(textMap).forEach(locale => {
        const weapon: Record<string, Record<string, string>> = {
            WEAPON_SWORD_ONE_HAND: {},
            WEAPON_CLAYMORE: {},
            WEAPON_POLE: {},
            WEAPON_CATALYST: {},
            WEAPON_BOW: {}
        }
        Object.entries(groupBy(weaponData, 'weaponType')).forEach(([k, v]) =>
            v.forEach(({ id, nameTextMapHash }) => {
                weapon[k][id] = textMap[locale][nameTextMapHash]
            })
        )
        parse(locale + '/weaponItem.json', weapon)
    })
}
