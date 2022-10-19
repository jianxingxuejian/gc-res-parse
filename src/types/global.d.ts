type Folder = 'res' | 'old' | 'new' | 'diff'

type Json = string | number | boolean | null | Json[] | JsonObject

type JsonObject = {
    [x in string]: Json
}

type DataObject = ({ id: string } & JsonObject) | Record<string, string>

type DataArray = string[] | number[] | DataObject[]

type Data = DataObject | DataArray
