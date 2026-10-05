import { type Pick, label, resolve } from './pick.ts'

export interface FormConfig {
  url: string
  fields: { type: string; choice: string; serviceLine: string; location: string }
  typeLabels: Record<Pick['kind'], string>
  noDeliveryLabel: string
}

export interface Details {
  serviceLine: string
  location: string
}

/** Build a Microsoft Forms pre-filled response URL, or null if the pick is invalid. */
export const buildFormUrl = (config: FormConfig, details: Details, pick: Pick | null): string | null => {
  const resolved = resolve(pick)
  if (!resolved) return null
  const url = new URL(config.url)
  const set = (field: string, value: string) => url.searchParams.set(field, value)
  set(config.fields.type, config.typeLabels[resolved.kind])
  set(config.fields.choice, label(resolved))
  set(config.fields.serviceLine, details.serviceLine)
  set(config.fields.location, resolved.kind === 'present' ? details.location : config.noDeliveryLabel)
  return url.toString()
}
