import { groupBy } from 'lodash-es'
import { readJson, textMap, parse, replaceToBlank } from '@/utils'

interface MaterialExcelConfigData {
    id: number
    materialType: string
    nameTextMapHash: string
    descTextMapHash: string
    rankLevel: number
}

export function parseMaterial() {
    const materialData = readJson<MaterialExcelConfigData[]>('ExcelBinOutput/MaterialExcelConfigData.json')
    const group = groupBy(materialData, 'materialType')

    Object.keys(textMap).forEach(locale => {
        const materialItem: Record<string, Record<string, string>> = {}
        Object.entries(group).forEach(([k, v]) => {
            const groupName = replaceToBlank(k, 'MATERIAL_')
            materialItem[groupName] = {}
            v.forEach(({ id, nameTextMapHash }) => {
                materialItem[groupName][id] = textMap[locale][nameTextMapHash]
            })
        })
        parse(locale + '/materialItem.json', materialItem)
    })
}
