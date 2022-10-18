import { readJson, diffAndWriteJson } from '@/utils'
import { differenceBy } from 'lodash-es'

interface Test {
    id: number
    name: string
}

export function test() {
    const testOldData = readJson<Test[]>('test.json', 'old')
    const testNewData = readJson<Test[]>('test.json', 'new')
    const diff = differenceBy(testNewData, testOldData, 'id')
    diffAndWriteJson(diff, 'test.json')
}
