export const toHSLObject = (hslStr) => {
    const [hue, saturation, lightness] = hslStr.match(/\d+/g).map(Number)
    return { hue, saturation, lightness }
}

export function HexToHSL(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    if (!result) {
        throw new Error('Could not parse Hex Color')
    }

    const rHex = parseInt(result[1], 16)
    const gHex = parseInt(result[2], 16)
    const bHex = parseInt(result[3], 16)

    const r = rHex / 255
    const g = gHex / 255
    const b = bHex / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    let hue = (max + min) / 2
    let saturation = hue
    let lightness = hue

    if (max === min) {
        // Achromatic
        return { h: 0, s: 0, l: lightness }
    }

    const d = max - min
    saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
        case r:
            hue = (g - b) / d + (g < b ? 6 : 0)
            break
        case g:
            hue = (b - r) / d + 2
            break
        case b:
            hue = (r - g) / d + 4
            break
    }
    hue /= 6

    saturation = saturation * 100
    saturation = Math.round(saturation)
    lightness = lightness * 100
    lightness = Math.round(lightness)
    hue = Math.round(360 * hue)

    return { hue, saturation, lightness }
}
