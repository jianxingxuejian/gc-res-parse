import { parse } from '@/utils'

type Test = {
    id: number
    name: string
}

export function test() {
    const newData: Test[] = [{ id: 1, name: 'new' }]
    parse('test.json', newData)
}
