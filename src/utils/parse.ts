import { difference, differenceBy, merge } from 'lodash-es'
import { writeJson, readJson } from '@/utils'

type Data = Arrayable<number[]> | Record<string, string> | DataObject[]
type ArrayData = PickArray<Data>

export function parse(fileName: string, newData: Data) {
    //write json data to new folder
    writeJson(fileName, newData, 'new')
    console.log(fileName + 'has been written successfully')
    // read json data from old folder
    const oldData = readJson<Data>(fileName, 'old')
    if (!oldData) {
        console.log('old data not found, stopped')
        return
    }
    diffAndMerge(fileName, [oldData, newData])
}

function diffAndMerge(fileName: string, params: Tuple2<Data>) {
    if (isArray(params)) {
        if (isNumberArray(params)) {
            const [oldData, newData] = params
            //@ts-ignore type security can be ensured here
            const diff = difference(newData, oldData)
            writeJson(fileName, diff, 'diff')
            writeJson(fileName, merge(oldData, diff), 'merge')
        } else if (isDataObjectArray(params)) {
            const [oldData, newData] = params
            const diff = differenceBy(newData, oldData, 'id')
            writeJson(fileName, diff, 'diff')
            const merge = Object.assign(oldData, diff)
            writeJson(fileName, merge, 'merge')
        }
    } else if (isRecord(params)) {
        const [oldData, newData] = params
        const diff: Record<string, string> = {}
        Object.entries(newData)
            .filter(([k]) => oldData[k] === undefined)
            .forEach(([k, v]) => (diff[k] = v))
        writeJson(fileName, diff, 'diff')
        writeJson(fileName, merge(oldData, diff), 'merge')
    }
}

function isArray(params: Tuple2<Data>): params is Tuple2<ArrayData> {
    return Array.isArray(params[0])
}
function isNumberArray(
    params: Tuple2<ArrayData>
): params is Tuple2<Arrayable<number[]>> {
    const first = params[0][0]
    return typeof first === 'number' || Array.isArray(first)
}
function isDataObjectArray(
    params: Tuple2<ArrayData>
): params is Tuple2<DataObject[]> {
    return typeof params[0][0] === 'object'
}
function isRecord(
    params: Tuple2<Data>
): params is Tuple2<Record<string, string>> {
    return !Array.isArray(params[0])
}
