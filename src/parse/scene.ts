import { readJson, textMap, parse } from '@/utils'

interface SceneExcelConfigData extends JsonObject {
    id: number
    scriptData: string
}

interface DungeonExcelConfigData extends JsonObject {
    sceneId: number
    nameTextMapHash: number
}

export function parseScene() {
    const sceneData = readJson<SceneExcelConfigData[]>('ExcelBinOutput/SceneExcelConfigData.json')
    if (!sceneData) return

    const dungeonData = readJson<DungeonExcelConfigData[]>('ExcelBinOutput/DungeonExcelConfigData.json')
    if (!dungeonData) return

    const scene_CHS: Record<string, string> = {}
    const scene_EN: Record<string, string> = {}

    const dungeonMap = new Map(dungeonData.map(item => [item.sceneId, item.nameTextMapHash]))

    sceneData
        .sort((a, b) => a.id - b.id)
        .forEach(({ id, scriptData }) => {
            const nameHash = dungeonMap.get(id)
            const name_CHS = nameHash && textMap['CHS'][nameHash]
            const name_EN = nameHash && textMap['EN'][nameHash]
            scene_CHS[id] = name_CHS || scriptData
            scene_EN[id] = name_EN || scriptData
        })

    parse('zh-CN/sceneItem.json', scene_CHS)
    parse('en-US/sceneItem.json', scene_EN)
}
