type Mode = 'res' | 'old' | 'new' | 'diff'

type Json = string | number | boolean | null | Json[] | JsonObject

type JsonObject = {
    [x in string]: Json
}
