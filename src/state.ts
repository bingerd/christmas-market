import { LOCATIONS, SERVICE_LINES } from './config.ts'
import { type Pick, sanitize } from './pick.ts'

export interface State {
  pick: Pick | null
  serviceLine: string
  location: string
}

const KEY = 'xebia-kerstmarkt-v2'

const initial = (): State => ({ pick: null, serviceLine: '', location: '' })

export const load = (): State => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (!raw) return initial()
    return {
      pick: sanitize(raw.pick),
      serviceLine: SERVICE_LINES.includes(raw.serviceLine) ? raw.serviceLine : '',
      location: LOCATIONS.includes(raw.location) ? raw.location : '',
    }
  } catch {
    return initial()
  }
}

export const save = (state: State) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // private mode etc.: the market still works, it just forgets on reload
  }
}

export const reset = (): State => {
  const fresh = initial()
  save(fresh)
  return fresh
}
