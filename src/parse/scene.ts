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

    const dungeonMap = new Map(dungeonData.map(item => [item.sceneId, item.nameTextMapHash]))

    sceneData.sort((a, b) => a.id - b.id)

    Object.keys(textMap).forEach(locale => {
        const scene: Record<string, string> = {}
        sceneData.forEach(({ id, scriptData }) => {
            const nameHash = dungeonMap.get(id)
            const name = nameHash && textMap[locale][nameHash]
            scene[id] = name || scriptData
        })
        parse(locale + '/sceneItem.json', scene)
    })
}
