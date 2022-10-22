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

// const locales = [
//     'CHS', 'CHT', 'DE', 'EN', 'ES', 'FR', 'ID',
//     'JP', 'KR', 'PT', 'RU', 'TH', 'VI'
// ]

const locales = ['CHS', 'EN']
const textMap: Record<string, Record<string, string>> = {}
locales.forEach(item => {
    const map = readJson<Record<string, string>>(`TextMap/TextMap${item}.json`)
    if (map) {
        textMap[item] = map
    }
})

export { textMap }
