// Chiptune "Jingle Bells" chorus (James Lord Pierpont, 1857, public domain),
// synthesised with Web Audio: no audio file to ship or license.

const BEAT = 0.17 // seconds per quarter note
const NOTE: Record<string, number> = { C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, C3: 130.81, F3: 174.61, G3: 196.0 }

// [note, beats]
const MELODY: Array<[string, number]> = [
  ['E5', 1], ['E5', 1], ['E5', 2],
  ['E5', 1], ['E5', 1], ['E5', 2],
  ['E5', 1], ['G5', 1], ['C5', 1.5], ['D5', 0.5],
  ['E5', 4],
  ['F5', 1], ['F5', 1], ['F5', 1.5], ['F5', 0.5],
  ['F5', 1], ['E5', 1], ['E5', 1], ['E5', 1],
  ['E5', 1], ['D5', 1], ['D5', 1], ['E5', 1],
  ['D5', 2], ['G5', 2],
]
// one bass note per bar
const BASS = ['C3', 'C3', 'C3', 'C3', 'F3', 'C3', 'G3', 'G3']

let ctx: AudioContext | undefined
let current: GainNode | undefined

const tone = (out: AudioNode, type: OscillatorType, freq: number, start: number, length: number, volume: number) => {
  const osc = ctx!.createOscillator()
  const env = ctx!.createGain()
  osc.type = type
  osc.frequency.value = freq
  env.gain.setValueAtTime(0, start)
  env.gain.linearRampToValueAtTime(volume, start + 0.005)
  env.gain.exponentialRampToValueAtTime(0.001, start + length * 0.9)
  osc.connect(env).connect(out)
  osc.start(start)
  osc.stop(start + length)
}

/** Play the tune (restarting it if it's already playing); returns its length in ms, or 0 without audio. */
export const playJingle = () => {
  try {
    ctx ??= new AudioContext()
    void ctx.resume()
  } catch {
    return 0
  }
  const now = ctx.currentTime + 0.05
  current?.gain.setTargetAtTime(0, now, 0.02)
  const master = ctx.createGain()
  master.gain.value = 0.08
  master.connect(ctx.destination)
  current = master

  let t = now
  for (const [note, beats] of MELODY) {
    tone(master, 'square', NOTE[note], t, beats * BEAT, 0.5)
    t += beats * BEAT
  }
  BASS.forEach((note, bar) => {
    for (let beat = 0; beat < 4; beat += 2) tone(master, 'triangle', NOTE[note], now + (bar * 4 + beat) * BEAT, 2 * BEAT, 0.9)
  })
  return Math.round((t - now) * 1000)
}
