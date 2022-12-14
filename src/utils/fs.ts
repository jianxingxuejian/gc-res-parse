import { config } from '../config'
import fs from 'fs-extra'
import path from 'path'

const { resourcesPath, newPath, oldPath, diffPath, mergePath } = config
const modeDict: Record<Folder, string> = {
    res: resourcesPath,
    new: newPath,
    old: oldPath,
    diff: diffPath,
    merge: mergePath
}

/** parse resources json file by fileName*/
export function readJson<T = Json>(fileName: string, folder: Folder = 'res') {
    const filePath = path.join(modeDict[folder], fileName)
    if (!fs.existsSync(filePath)) {
        return undefined
    }
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data) as T
}

/** write json object to file */
export function writeJson(fileName: string, json: Json | object, mode: Folder = 'new') {
    const filePath = path.join(process.cwd(), modeDict[mode], fileName)
    mkdir(filePath)
    fs.writeFile(filePath, JSON.stringify(json), 'utf-8')
}

export function readDir(fileName: string) {
    const filePath = path.join(modeDict['res'], fileName)
    return fs.readdirSync(filePath, 'utf-8')
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
