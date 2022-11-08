import { difference, differenceBy, merge } from 'lodash-es'
import { addedDiff } from 'deep-object-diff'
import { writeJson, readJson } from '@/utils'

type Data = Arrayable<number[]> | Record<string, Json> | DataObject[]
type ArrayData = PickArray<Data>

export function parse(fileName: string, newData: Data) {
    //write json data to new folder
    writeJson(fileName, newData, 'new')
    // read json data from old folder
    const oldData = readJson<Data>(fileName, 'old')
    if (!oldData) {
        return
    }
    diffAndMerge(fileName, [oldData, newData])
}

function diffAndMerge(fileName: string, params: Tuple2<Data>) {
    if (isArray(params)) {
        if (isNumArray(params)) {
            const [oldData, newData] = params
            const diffData = difference(newData, oldData)
            writeJson(fileName, diffData, 'diff')
            writeJson(fileName, merge(oldData, diffData), 'merge')
        } else if (is2dNumArray(params)) {
            const [oldData, newData] = params
            const diffData = newData.map((x, i) => difference(x, oldData[i]))
            writeJson(fileName, diffData, 'diff')
            writeJson(fileName, merge(oldData, diffData), 'merge')
        } else if (isDataObjectArray(params)) {
            const [oldData, newData] = params
            const diffData = differenceBy(newData, oldData, 'id')
            writeJson(fileName, diffData, 'diff')
            const mergeData = oldData.concat(diffData).sort((a, b) => a.id - b.id)
            writeJson(fileName, mergeData, 'merge')
        }
    } else if (isRecord(params)) {
        const [oldData, newData] = params
        const diffData: Record<string, Json> = {}
        if (typeof oldData[0] === 'string') {
            Object.entries(newData)
                .filter(([k]) => oldData[k] === undefined)
                .forEach(([k, v]) => (diffData[k] = v))
            writeJson(fileName, diffData, 'diff')
            writeJson(fileName, merge(oldData, diffData), 'merge')
        } else {
            const diffData = addedDiff(oldData, newData)
            writeJson(fileName, diffData, 'diff')
            writeJson(fileName, merge(oldData, diffData), 'merge')
        }
    }
}

function isArray(params: Tuple2<Data>): params is Tuple2<ArrayData> {
    return Array.isArray(params[0])
}
function isNumArray(params: Tuple2<ArrayData>): params is Tuple2<number[]> {
    const first = params[0][0]
    return typeof first === 'number'
}
function is2dNumArray(params: Tuple2<ArrayData>): params is Tuple2<number[][]> {
    const first = params[0][0]
    return Array.isArray(first) && typeof first[0] === 'number'
}
function isDataObjectArray(params: Tuple2<ArrayData>): params is Tuple2<DataObject[]> {
    return typeof params[0][0] === 'object'
}
function isRecord(params: Tuple2<Data>): params is Tuple2<Record<string, Json>> {
    return !Array.isArray(params[0])
}
