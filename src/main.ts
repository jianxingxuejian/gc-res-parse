import { parseWeather, parseMonster, parseQuest } from './parse'

function parse() {
    const args = process.argv.slice(2).map(item => item.toLocaleLowerCase())
    const check = (name: string) =>
        args.some(item => item === name || item === 'all')

    if (check('weather')) {
        parseWeather()
    }
    if (check('monster')) {
        parseMonster()
    }
    if (check('quest')) {
        parseQuest()
    }
}

parse()
