type Position = 'res' | 'old' | 'new' | 'diff'

type Json = string | number | boolean | null | undefined | Json[] | JsonObject

type JsonObject = {
    [x in string]: Json
}
