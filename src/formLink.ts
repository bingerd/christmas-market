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

/**
 * Build a Microsoft Forms pre-filled response URL, or null if the pick is invalid.
 * Forms expects choice answers wrapped in double quotes and text answers bare,
 * with spaces as %20 (not the `+` URLSearchParams would write).
 */
export const buildFormUrl = (config: FormConfig, details: Details, pick: Pick | null): string | null => {
  const resolved = resolve(pick)
  if (!resolved) return null
  const quoted = (value: string) => `"${value}"`
  const answers: [string, string][] = [
    [config.fields.type, quoted(config.typeLabels[resolved.kind])],
    [config.fields.choice, label(resolved)],
    [config.fields.serviceLine, quoted(details.serviceLine)],
    [config.fields.location, quoted(resolved.kind === 'present' ? details.location : config.noDeliveryLabel)],
  ]
  const query = answers.map(([field, value]) => `&${field}=${encodeURIComponent(value)}`).join('')
  return config.url + query
}
