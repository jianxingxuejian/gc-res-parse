import fs from 'fs-extra'
import path from 'path'
import { writeJson, readJson } from '@/utils'

export function parse(fileName: string, data: Data) {
    //write json data to new folder
    writeJson(fileName, data, 'new')
    console.log(fileName + 'has been written successfully')
    // read json data from old folder
    const oldData = readJson(fileName, 'old')
    if (!oldData) {
        console.log('old data not found, stopped')
        return
    }
    //diff and merge
    // if (typeof oldData === 'object') {
    //     if (!Array.isArray(data)) {
    //         const key = data[0]
    //         if (Number.isInteger(key)) {
    //         }
    //     } else if (data.length > 0) {
    //         const first = data[0]
    //         if (typeof first === 'object') {
    //         }
    //     }
    // }
}
