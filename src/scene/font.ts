// 3×5 pixel font for signs and labels inside the SVG scenes.
const GLYPHS: Record<string, string> = {
  A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110',
  E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101',
  I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
  M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100',
  Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
  U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
  Y: '101101010010010', Z: '111001010100111', '0': '111101101101111', '1': '010110010010111',
  '2': '110001010100111', '6': '011100111101111', ' ': '000000000000000', '*': '000101010101000',
  '-': '000000111000000', '.': '000000000000010', '!': '010010010000010', '&': '010101010101011',
}

export const textWidth = (text: string) => text.length * 4 - 1

/** Pixel text as rects; (x, y) is the top-left corner. */
export const pixelText = (text: string, x: number, y: number, fill: string) => {
  let out = ''
  ;[...text.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '')].forEach((ch, i) => {
    const g = GLYPHS[ch] ?? GLYPHS[' ']
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 3; col++)
        if (g[row * 3 + col] === '1') out += `<rect x="${x + i * 4 + col}" y="${y + row}" width="1" height="1"/>`
  })
  return `<g fill="${fill}">${out}</g>`
}
