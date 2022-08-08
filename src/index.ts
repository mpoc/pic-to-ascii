import { createCanvas } from 'canvas'
import open from 'open'

type Brightness = [string, number]

const closerTo = (x: number, a: number, b: number) => Math.abs(x - a) < Math.abs(x - b) ? a : b

const remapValue = (x: number, a: number, b: number, c: number, d: number): number => {
    return c + (((d - c) / (b - a)) * (x - a))
}

const clampValue = (x: number, min: number, max: number): number => {
    if (x < min) return min
    if (x > max) return max
    return x
}

const remapClampValue = (x: number, a: number, b: number, c: number, d: number): number => {
    const remappedX = remapValue(x, a, b, c, d)
    const clampedX = clampValue(remappedX, c, d)
    return clampedX
}

const getCharacterForBrightness = (brightness: number, sortedBrightnesses: Brightness[]): string => {
    let firstIndex = 0
    let lastIndex = sortedBrightnesses.length - 1
    let middleIndex = Math.floor((firstIndex + lastIndex) / 2)

    while (firstIndex <= lastIndex) {
        middleIndex = Math.floor((firstIndex + lastIndex) / 2)
        if (sortedBrightnesses[middleIndex][1] < brightness) {
            firstIndex = middleIndex + 1
        } else if (sortedBrightnesses[middleIndex][1] > brightness) {
            lastIndex = middleIndex - 1
        } else {
            return sortedBrightnesses[middleIndex][0]
        }
    }

    return sortedBrightnesses[middleIndex][0]
}

const normaliseCharBrightnesses = (charBrightnesses: Brightness[]): Brightness[] => {
    const min = charBrightnesses[0][1]
    const max = charBrightnesses[charBrightnesses.length - 1][1]
    return charBrightnesses.map(brightness => [brightness[0], remapClampValue(brightness[1], min, max, 0, 1)])
}

const getCharCanvasContext = (char: string) => {
    const canvas = createCanvas(200, 200)
    const ctx = canvas.getContext('2d')

    ctx.font = '100px Impact'
    ctx.fillText(char, 10, 190)

    return {
        canvas,
        ctx,
    }
}

const getCharBrightness = (char: string): number => {
    const { canvas, ctx } = getCharCanvasContext(char)
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    
    const a = new Map()
    for (let i = 0; i < data.length; i += 4) {
        const red = data[i]
        const green = data[i + 1]
        const blue = data[i + 2]
        const alpha = data[i + 3]
        
        const talpha = closerTo(alpha, 0, 255)
    
        if (a.has(talpha)) {
            a.set(talpha, a.get(talpha) + 1)
        } else {
            a.set(talpha, 1)
        }
    
        // console.log(
        //     red,
        //     green,
        //     blue,
        //     alpha,
        // )
    }
    const ratio = (a.get(255) || 0) / data.length
    return ratio
}

const main = async () => {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        + 'abcdefghijklmnopqrstuvwxyz'
        + '1234567890'
        + '!@#$%^&*()_+-=[]{}|;:,./<>?`~ '
        // + '▀▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▐░▒▓▔▕▖▗▘▙▚▛▜▝▞▟'
    const charBrightnesses: Brightness[] = chars
        .split('')
        .map(char => [char, getCharBrightness(char)])
    const sortedCharBrightnesses = normaliseCharBrightnesses(charBrightnesses.sort((a, b) => b[1] - a[1]))
    console.log(sortedCharBrightnesses)
    console.log(0.0, getCharacterForBrightness(0.0, sortedCharBrightnesses))
    console.log(0.1, getCharacterForBrightness(0.1, sortedCharBrightnesses))
    console.log(0.2, getCharacterForBrightness(0.2, sortedCharBrightnesses))
    console.log(0.3, getCharacterForBrightness(0.3, sortedCharBrightnesses))
    console.log(0.4, getCharacterForBrightness(0.4, sortedCharBrightnesses))
    console.log(0.5, getCharacterForBrightness(0.5, sortedCharBrightnesses))
    console.log(0.6, getCharacterForBrightness(0.6, sortedCharBrightnesses))
    console.log(0.7, getCharacterForBrightness(0.7, sortedCharBrightnesses))
    console.log(0.8, getCharacterForBrightness(0.8, sortedCharBrightnesses))
    console.log(0.9, getCharacterForBrightness(0.9, sortedCharBrightnesses))
}

main()
