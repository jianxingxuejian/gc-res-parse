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
    if (!fs.existsSync(filePath)) {
        throw new Error('path not exist')
    }
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data) as T
}

/** write json object to file */
export function writeJson(fileName: string, json: Json, mode: Mode = 'new') {
    const filePath = path.join(process.cwd(), modeDict[mode], fileName)
    mkdir(filePath)
    fs.writeFile(filePath, JSON.stringify(json, null, '\t'), 'utf-8')
}

export function diffAndWriteJson(data: JsonObject[], fileName: string) {
    try {
        const oldData = readJson(fileName, 'old')
        const diff = difference(data, oldData)
        writeJson(fileName, diff, 'diff')
    } catch (error) {
        console.log("does't has old file to diff")
    }
}

function mkdir(path: string) {
    if (!fs.existsSync(path)) {
        const parent = path.split('\\').slice(0, -1)
        if (parent) {
            fs.mkdirSync(parent.join('/'), { recursive: true })
        } else {
            throw new Error('path not exist')
        }
    }
}
