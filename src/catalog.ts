// Placeholder catalogue. Swap names, descriptions, prices and images as
// suppliers confirm their packages. Images live in public/images/; drop a
// real photo in with the same path (or point `image` at a new file).

export interface Charity {
  id: string
  name: string
  tagline: string
  description: string
  image: string
  url?: string
}

export interface Package {
  id: string
  name: string
  description: string
  image: string
}

export interface Supplier {
  id: string
  name: string
  kind: string
  description: string
  image: string
  /** Awning colour of the stall in the market. */
  color: string
  packages: Package[]
}

export const charities: Charity[] = [
  {
    id: 'free-a-girl',
    name: 'Free a Girl',
    tagline: 'Fighting child prostitution',
    description: 'Placeholder: rescues girls from forced prostitution and helps bring perpetrators to justice.',
    image: '/images/charities/free-a-girl.svg',
    url: 'https://www.freeagirl.nl',
  },
  {
    id: 'leger-des-heils',
    name: 'Leger des Heils',
    tagline: 'Shelter, food and a fresh start',
    description: 'Placeholder: supports homeless and vulnerable people with shelter, meals and guidance.',
    image: '/images/charities/leger-des-heils.svg',
    url: 'https://www.legerdesheils.nl',
  },
]

const tiers = (
  supplier: string,
  items: Array<[name: string, description: string]>,
): Package[] =>
  items.map(([name, description], i) => ({
    id: `${supplier}-${i + 1}`,
    name,
    description,
    image: `/images/packages/${supplier}-${i + 1}.svg`,
  }))

export const suppliers: Supplier[] = [
  {
    id: 'alexanderhoeve',
    name: 'Alexanderhoeve',
    kind: 'Farm dairy',
    description: 'Placeholder: family dairy farm with cheese, yoghurt and other goodies straight from the farm.',
    image: '/images/suppliers/alexanderhoeve.svg',
    color: '#f2c94c',
    packages: tiers('alexanderhoeve', [
      ['Cheese taster', 'Placeholder: a couple of farm cheeses to try.'],
      ['Farm breakfast', 'Placeholder: cheese, yoghurt and something sweet.'],
      ['Cheese board', 'Placeholder: a full cheese board with condiments.'],
      ['The whole farm', 'Placeholder: a bit of everything from the farm.'],
    ]),
  },
  {
    id: 'weldam-wijn',
    name: 'Weldam Wijn',
    kind: 'Wine estate',
    description: 'Placeholder: Dutch wine from the Weldam estate in Twente.',
    image: '/images/suppliers/weldam-wijn.svg',
    color: '#9b2335',
    packages: tiers('weldam-wijn', [
      ['Single bottle', 'Placeholder: one bottle of estate wine.'],
      ['Red & white duo', 'Placeholder: a red and a white.'],
      ['Wine & bites', 'Placeholder: wine with something to nibble.'],
    ]),
  },
  {
    id: 'olala-chocola',
    name: 'Olala Chocola',
    kind: 'Chocolatier',
    description: 'Placeholder: handmade chocolate, bonbons and bars.',
    image: '/images/suppliers/olala-chocola.svg',
    color: '#7b4a2d',
    packages: tiers('olala-chocola', [
      ['Bar of joy', 'Placeholder: one fancy chocolate bar.'],
      ['Bonbon box', 'Placeholder: a box of handmade bonbons.'],
      ['Chocolate letter', 'Placeholder: a Christmas chocolate letter.'],
      ['Chocoholic deluxe', 'Placeholder: a mix of their bestsellers.'],
    ]),
  },
  {
    id: 'oldenhof',
    name: 'Oldenhof',
    kind: 'Delicatessen',
    description: 'Placeholder: description of Oldenhof and what they make.',
    image: '/images/suppliers/oldenhof.svg',
    color: '#2e7d4f',
    packages: tiers('oldenhof', [
      ['Sweet treat', 'Placeholder: package contents to be confirmed.'],
      ['Savoury treat', 'Placeholder: package contents to be confirmed.'],
      ['Festive treat', 'Placeholder: package contents to be confirmed.'],
    ]),
  },
]

export const findPackage = (id: string) => {
  for (const supplier of suppliers) {
    const pkg = supplier.packages.find((p) => p.id === id)
    if (pkg) return { supplier, pkg }
  }
  return undefined
}

export const findCharity = (id: string) => charities.find((c) => c.id === id)
