type Folder = 'res' | 'old' | 'new' | 'diff' | 'merge'

type Json = string | number | boolean | null | Json[] | JsonObject

type JsonObject = {
    [x in string]: Json
}

type DataObject = { id: number } & JsonObject
