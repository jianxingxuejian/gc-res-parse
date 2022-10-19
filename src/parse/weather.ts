import { readJson, writeJson, replaceToBlank } from '@/utils'
import { groupBy, sortedUniq, difference } from 'lodash-es'

interface WeatherExcelConfigData extends JsonObject {
    areaId: number
    weatherAreaId: number
    profileName: string
    defaultClimate: Climate
    sceneId: number
}

type Climate =
    | 'CLIMATE_SUNNY'
    | 'CLIMATE_CLOUDY'
    | 'CLIMATE_RAIN'
    | 'CLIMATE_THUNDERSTORM'
    | 'CLIMATE_MIST'

const file_item = 'weatherItem.json'
const file_ids = 'weatherIds.json'

export function parseWeather() {
    const weatherData = readJson<WeatherExcelConfigData[]>(
        'ExcelBinOutput/WeatherExcelConfigData.json'
    )

    const weatherItem: JsonObject = {}
    const replaceArr = ['Data/Environment/EnviroSystemProfile/', '/ESP', 'ESP_']
    weatherData.forEach(({ areaId, profileName }) => {
        weatherItem[areaId] = replaceToBlank(profileName, replaceArr)
    })
    writeJson(file_item, weatherItem)

    const filterByKeyword = (keyword: string[]) =>
        weatherData
            .filter(item => keyword.some(k => item.profileName.includes(k)))
            .map(item => item.areaId)

    const general = filterByKeyword(['Md_General', 'Ly_General', 'Dq_General'])
    const general_xm = filterByKeyword(['Xm_General'])

    const group = (key: Climate) =>
        groupBy(weatherData, 'defaultClimate')[key].map(item => item.areaId)

    const sunny = group('CLIMATE_SUNNY')
    const cloudy = group('CLIMATE_CLOUDY')
    const rain = group('CLIMATE_RAIN')
    const thunderstorm = group('CLIMATE_THUNDERSTORM')
    const snow_pick = [
        0, 2022, 2023, 2028, 2029, 2034, 2035, 2037, 2113, 2117, 2118, 2121,
        2124, 2127, 2130, 2132, 2135, 2138, 2191, 2225
    ]
    const mist = group('CLIMATE_MIST')
    const mist_pick = [
        2024, 2025, 2027, 2031, 2032, 2036, 2038, 2039, 2125, 2131
    ]

    const weather = sortedUniq([
        [0, ...general, ...general_xm, ...sunny],
        cloudy,
        [0, ...general, ...general_xm, ...rain],
        [0, ...general, ...general_xm, ...thunderstorm],
        snow_pick,
        [0, ...general, ...mist, ...mist_pick]
    ])

    writeJson(file_ids, weather)

    // readJson('weatherIds.json', 'old')
}
