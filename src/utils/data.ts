import { readJson } from '@/utils'

export function replaceToBlank(text: string, search: string | string[]) {
    if (typeof search === 'string') {
        text.replace(search, '')
    } else {
        search.forEach(item => text.replace(item, ''))
    }
    return text
}

export function includesArray(text: string, values: string[]) {
    values.forEach(item => {
        if (text.includes(item)) {
            return true
        }
    })
    return false
}

// const locales = [
//     'CHS', 'CHT', 'DE', 'EN', 'ES', 'FR', 'ID',
//     'JP', 'KR', 'PT', 'RU', 'TH', 'VI'
// ]

const locales = ['CHS', 'EN']
const items: Record<string, Record<number, string>> = {}
locales.forEach(item => {
    const map = readJson<Record<number, string>>(`TextMap/TextMap${item}.json`)
    if (map) {
        textMap[item] = map
    }
})

export const textMap = items
