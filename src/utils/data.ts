import { readJson } from './fs'

export function replaceToBlank(text: any, search: string | string[]) {
    if (!(typeof text === 'string')) return ''

    if (typeof search === 'string') {
        text = text.replaceAll(search, '')
    } else {
        search.forEach(item => (text = text.replaceAll(item, '')))
    }
    return text as string
}

export function includesArray(text: string | undefined, values: string[]) {
    if (text === undefined) return false
    for (const item of values) {
        if (text.includes(item)) {
            return true
        }
    }
    return false
}

const localeDict = {
    CHS: 'zh-CN',
    CHT: 'zh-TW',
    DE: 'de',
    EN: 'en',
    ES: 'es',
    FR: 'fr',
    ID: 'id-ID',
    JP: 'ja-JP',
    KR: 'ko-KR',
    PT: 'pt',
    RU: 'ru-RU',
    TH: 'th-TH',
    VI: 'vi-VN'
}

const textMap: Record<string, Record<string, string>> = {}
Object.entries(localeDict).forEach(([k, v]) => {
    const map = readJson<Record<string, string>>(`TextMap/TextMap${k}.json`)
    if (map) {
        textMap[v] = map
    }
})

export { textMap }
