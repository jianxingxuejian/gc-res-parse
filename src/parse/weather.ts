import { groupBy, sortedUniq } from 'lodash-es'
import { readJson, parse, replaceToBlank } from '@/utils'

interface WeatherExcelConfigData extends JsonObject {
    areaID: number
    weatherAreaId: number
    profileName: string
    defaultClimate: Climate
    sceneId: number
}

type Climate = 'CLIMATE_SUNNY' | 'CLIMATE_CLOUDY' | 'CLIMATE_RAIN' | 'CLIMATE_THUNDERSTORM' | 'CLIMATE_MIST'

const file_item = 'weatherItem.json'
const file_ids = 'weatherIds.json'

export function parseWeather() {
    const weatherData = readJson<WeatherExcelConfigData[]>('ExcelBinOutput/WeatherExcelConfigData.json')
    if (!weatherData) return

    const weatherItem: Record<string, string> = {}
    const replaceArr = ['Data/Environment/EnviroSystemProfile/', '/ESP', 'ESP_']
    weatherData.forEach(({ areaID: areaId, profileName }) => {
        weatherItem[areaId] = replaceToBlank(profileName, replaceArr)
    })
    parse(file_item, weatherItem)

    const filterByKeyword = (keyword: string[]) =>
        weatherData.filter(item => keyword.some(k => item.profileName.includes(k))).map(item => item.areaID)

    const general = filterByKeyword(['Md_General', 'Ly_General', 'Dq_General'])
    const general_xm = filterByKeyword(['Xm_General'])

    const group = (key: Climate) => groupBy(weatherData, 'defaultClimate')[key].map(item => item.areaID)

    const sunny = group('CLIMATE_SUNNY')
    const cloudy = group('CLIMATE_CLOUDY')
    const rain = group('CLIMATE_RAIN')
    const thunderstorm = group('CLIMATE_THUNDERSTORM')
    const snow_pick = [
        0, 2022, 2023, 2028, 2029, 2034, 2035, 2037, 2113, 2117, 2118, 2121, 2124, 2127, 2130, 2132, 2135, 2138, 2191,
        2225
    ]
    const mist = group('CLIMATE_MIST')
    const mist_pick = [2024, 2025, 2027, 2031, 2032, 2036, 2038, 2039, 2125, 2131]

    const weather = [
        [0, ...general, ...general_xm, ...sunny],
        cloudy,
        [0, ...general, ...general_xm, ...rain],
        [0, ...general, ...general_xm, ...thunderstorm],
        snow_pick,
        [0, ...general, ...mist, ...mist_pick]
    ].map(item => sortedUniq(item.sort((a, b) => a - b)))

    parse(file_ids, weather)
}
