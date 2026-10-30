import { type Charity, type Package, type Supplier, findCharity, findPackage } from './catalog.ts'

/** Everyone picks exactly one thing: a present or a donation. */
export type Pick = { kind: 'present'; id: string } | { kind: 'donate'; id: string }

export type Resolved =
  | { kind: 'present'; pkg: Package; supplier: Supplier }
  | { kind: 'donate'; charity: Charity; animal?: Package }

export const resolve = (pick: Pick | null): Resolved | null => {
  if (!pick) return null
  if (pick.kind === 'present') {
    const found = findPackage(pick.id)
    return found ? { kind: 'present', ...found } : null
  }
  const found = findCharity(pick.id)
  return found ? { kind: 'donate', ...found } : null
}

const describe = (r: Resolved, name: 'name' | 'formName') => {
  if (r.kind === 'present') return `${r.supplier.name} – ${r.pkg[name]}`
  return r.animal ? `${r.charity.name} – ${r.animal[name]}` : `Donation to ${r.charity.name}`
}

/** Human readable, in English. */
export const label = (r: Resolved) => describe(r, 'name')

/** What ends up in the Form: the Dutch names the stalls know their products by. */
export const formLabel = (r: Resolved) => describe(r, 'formName')

/** Presents and adoption packs get dropped off at an office; a plain donation doesn't. */
export const needsDelivery = (pick: Pick | null) => {
  const r = resolve(pick)
  return r?.kind === 'present' || !!r?.animal
}

/** Validate whatever came out of storage against the catalogue. */
export const sanitize = (raw: unknown): Pick | null => {
  if (!raw || typeof raw !== 'object') return null
  const { kind, id } = raw as Record<string, unknown>
  if ((kind !== 'present' && kind !== 'donate') || typeof id !== 'string') return null
  const pick: Pick = { kind, id }
  return resolve(pick) ? pick : null
}
