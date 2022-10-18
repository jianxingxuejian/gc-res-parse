import { config } from '../config'
import fs from 'fs-extra'
import path from 'path'
import { difference } from 'lodash-es'

const { resourcesPath, newPath, oldPath, diffPath } = config
const modeDict: Record<Mode, string> = {
    res: resourcesPath,
    new: newPath,
    old: oldPath,
    diff: diffPath
}

/** parse resources json file by fileName*/
export function readJson<T = any>(fileName: string, mode: Mode = 'res') {
    const filePath = path.join(modeDict[mode], fileName)
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data) as T
}

/** write json object to file */
export function writeJson(fileName: string, json: Json, mode: Mode = 'res') {
    const filePath = path.join(modeDict[mode], fileName)
    fs.writeFile(filePath, JSON.stringify(json))
}

export function diffAndWriteJson(data: Json, fileName: string) {
    const oldData = readJson(fileName, 'old')
    const diff = difference(data, oldData)
    writeJson(fileName, diff, 'diff')
}
