import { readJson, textMap, parse } from '@/utils'

interface AvatarExcelConfigData {
    id: number
    nameTextMapHash: string
}

export function parseAvatar() {
    const avatarData = readJson<AvatarExcelConfigData[]>('ExcelBinOutput/AvatarExcelConfigData.json')
    if (!avatarData) return

    Object.keys(textMap).forEach(locale => {
        const avatar: Record<string, string> = {}
        avatarData.forEach(({ id, nameTextMapHash }) => {
            avatar[id] = textMap[locale][nameTextMapHash]
        })
        parse(locale + '/avatarItem.json', avatar)
    })
}
