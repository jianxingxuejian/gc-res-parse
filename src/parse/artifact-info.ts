import { readJson, textMap, parse } from '@/utils'
import { groupBy } from 'lodash-es'

interface EquipAffixExcelConfigData extends JsonObject {
    id: number
    affixId: number
    nameTextMapHash: number
    descTextMapHash: number
}

type ArtifactInfo = {
    id: number
    name: string
    desc1: string
    desc2: string
}

export function parseArtifact() {
    const equipData = readJson<EquipAffixExcelConfigData[]>('ExcelBinOutput/EquipAffixExcelConfigData.json')
    if (!equipData) return

    const group = groupBy(equipData, 'id')
    const data = Object.values(group)
        .filter(item => item[0].id >= 214001 && item.length === 2)
        .map(item => {
            let first: EquipAffixExcelConfigData
            let second: EquipAffixExcelConfigData
            if (item[0].affixId.toString().endsWith('0')) {
                first = item[0]
                second = item[1]
            } else {
                first = item[1]
                second = item[0]
            }
            return {
                id: first.id,
                nameHash: first.nameTextMapHash,
                desc1Hash: first.descTextMapHash,
                desc2Hash: second.descTextMapHash
            }
        })

    Object.keys(textMap).forEach(locale => {
        const artifactInfos: ArtifactInfo[] = []
        data.forEach(item => {
            const id = item.id
            const name = textMap[locale][item.nameHash]
            const desc1 = textMap[locale][item.desc1Hash]
            const desc2 = textMap[locale][item.desc2Hash]
            artifactInfos.push({ id, name, desc1, desc2 })
        })
        parse(locale + '/artifactInfo.json', artifactInfos)
    })
}
