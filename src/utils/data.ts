export function replaceToBlank(text: string, search: string | string[]) {
    if (typeof search === 'string') {
        text.replace(search, '')
    } else {
        search.forEach(item => text.replace(item, ''))
    }
    return text
}
