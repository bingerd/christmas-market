import { type Charity, type Package, type Supplier, findCharity, findPackage } from './catalog.ts'

/** Everyone picks exactly one thing: a present or a donation. */
export type Pick = { kind: 'present'; id: string } | { kind: 'donate'; id: string }

export type Resolved =
  | { kind: 'present'; pkg: Package; supplier: Supplier }
  | { kind: 'donate'; charity: Charity }

export const resolve = (pick: Pick | null): Resolved | null => {
  if (!pick) return null
  if (pick.kind === 'present') {
    const found = findPackage(pick.id)
    return found ? { kind: 'present', ...found } : null
  }
  const charity = findCharity(pick.id)
  return charity ? { kind: 'donate', charity } : null
}

/** Human readable, also what ends up in the Form. */
export const label = (r: Resolved) =>
  r.kind === 'present' ? `${r.supplier.name} – ${r.pkg.name}` : `Donation to ${r.charity.name}`

export const needsDelivery = (pick: Pick | null) => resolve(pick)?.kind === 'present'

/** Validate whatever came out of storage against the catalogue. */
export const sanitize = (raw: unknown): Pick | null => {
  if (!raw || typeof raw !== 'object') return null
  const { kind, id } = raw as Record<string, unknown>
  if ((kind !== 'present' && kind !== 'donate') || typeof id !== 'string') return null
  const pick: Pick = { kind, id }
  return resolve(pick) ? pick : null
}
