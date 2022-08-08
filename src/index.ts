import { createCanvas } from 'canvas'

const closerTo = (x: number, a: number, b: number) => Math.abs(x - a) < Math.abs(x - b) ? a : b

const charBrightness = (char: string): number => {
    const canvas = createCanvas(200, 200)
    const ctx = canvas.getContext('2d')
    
    ctx.font = '200px Impact'
    ctx.fillText(char, 10, 190)
    
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
    const ratio = a.get(255) / data.length
    return ratio
}

const main = async () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const charBrightnesses: [string, number][] = chars
        .split('')
        .map(char => [char, charBrightness(char)])
    const sortedCharBrightnesses = charBrightnesses.sort((a, b) => b[1] - a[1])
    console.log(sortedCharBrightnesses)
}

main()
