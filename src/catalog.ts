// The catalogue: charities, suppliers and what's on offer at each stall.
// `image` is a path inside src/images/. Photos are 4:3 JPEGs; pixel-art
// placeholders are SVGs that scripts/make-placeholders.ts can regenerate.

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
    id: 'wwf',
    name: 'WWF',
    tagline: 'Protecting nature and wildlife',
    description: 'Works around the world to protect wildlife and the places they live, from forests and oceans to the climate.',
    image: 'charities/wwf.svg',
    url: 'https://www.wwf.nl',
  },
  {
    id: 'het-vergeten-kind',
    name: 'Het Vergeten Kind',
    tagline: 'For children nobody sees',
    description: 'Stands up for vulnerable children in the Netherlands who grow up in an unsafe or unstable home, so they feel seen and heard and get a fair start.',
    image: 'charities/het-vergeten-kind.svg',
    url: 'https://www.hetvergetenkind.nl',
  },
]

/**
 * Package ids are `<supplier>-<slug>`: picks are stored by id, so a slug
 * must keep meaning the same item. The image defaults to `<slug>.jpg`.
 */
const stock = (
  supplier: string,
  items: Array<[slug: string, name: string, description: string, file?: string]>,
): Package[] =>
  items.map(([slug, name, description, file = `${slug}.jpg`]) => ({
    id: `${supplier}-${slug}`,
    name,
    description,
    image: `suppliers/${supplier}/${file}`,
  }))

export const suppliers: Supplier[] = [
  {
    id: 'de-magistraat',
    name: 'De Magistraat',
    kind: 'Craft brewery',
    description: 'Craft brewery with its own taproom. Take home a box of their special beers, or a gift card for the taproom.',
    image: 'suppliers/de-magistraat/stall.svg',
    color: '#3d9be0',
    packages: stock('de-magistraat', [
      ['beer-box-extras', 'Beer box with extras', 'Seven special beers, plus a metal sign and a beer glass.'],
      ['twelve-beers', 'Big beer box', 'Twelve different special beers from De Magistraat.'],
      ['barrel-aged', 'Barrel-aged box', 'Three barrel-aged beers, two of them new secret releases, plus two of their core beers.', 'barrel-aged.svg'],
      ['gift-card', 'Gift card', 'Spend it in the taproom on drinks, lunch or dinner. Not valid in the webshop.', 'gift-card.svg'],
    ]),
  },
  {
    id: 'balthazar',
    name: 'Balthazar',
    kind: 'Kitchen shop',
    description: 'Cookware, tableware and delicatessen. Pick something for your kitchen or table, a goodie bag or a gift card.',
    image: 'suppliers/balthazar/stall.svg',
    color: '#2e7d4f',
    packages: stock('balthazar', [
      ['pasta-machine', 'Pasta machine', 'Stainless steel, for fresh tagliolini, tagliatelle and lasagne.'],
      ['teak-board', 'Teak cutting board', 'FSC-certified teak with a juice groove, 40 × 30 cm.'],
      ['fibre-board', 'Black fibre cutting board', 'Combekk wood-fibre board, dishwasher safe, 28 × 38 cm.'],
      ['chef-knife', "Sabatier chef's knife", 'Sabatier Integra in stainless steel, with a dimpled blade and a riveted black handle.'],
      ['even-simpel', 'Cookbook: Even Simpel', 'By Ottolenghi: 135 recipes that are ready in under 30 minutes.'],
      ['toscanini', 'Cookbook: Toscanini Pasta', 'Italian pasta classics from every region.'],
      ['cheese-plates', 'Cheese plates', 'Set of 4 ceramic plates with vintage cheese labels, in a gift box.'],
      ['mandoline', 'Mandoline slicer', 'Adjustable from 0 to 9 mm, with a julienne setting. Folds flat.'],
      ['spiegelau-red', 'Spiegelau red wine glasses', 'Set of 4, crystal glass.'],
      ['spiegelau-white', 'Spiegelau white wine glasses', 'Set of 4, crystal glass.'],
      ['spiegelau-champagne', 'Spiegelau champagne flutes', 'Set of 4, crystal glass.'],
      ['bundt-nove', 'Bundt tin Nove', 'Cast aluminium with a non-stick coating, 24 cm.'],
      ['bundt-star', 'Bundt tin Star', 'Cast aluminium with a non-stick coating, 24 cm.'],
      ['bundt-classic', 'Bundt tin Classic', 'Cast aluminium with a non-stick coating, 24 cm.'],
      ['fondue-set', 'Fondue set Aspen', 'Cast iron, with a burner and 4 forks.'],
      ['grater-dish', 'Alhambra grater dish', 'Handmade and hand-painted in Spain, for garlic and ginger.'],
      ['roll-holder-robin', 'Kitchen roll holder Robin', 'With a hand-carved, hand-painted wooden robin on top.'],
      ['roll-holder-wren', 'Kitchen roll holder Wren', 'With a hand-carved, hand-painted wooden wren on top.'],
      ['surprise-bag', 'Surprise bag', 'A Balthazar goodie bag filled with €50 worth of surprises.'],
      ['gift-card', 'Gift card', 'Worth €35, to spend in the shop or in the webshop.'],
    ]),
  },
  {
    id: 'alexanderhoeve',
    name: 'Alexanderhoeve',
    kind: 'Farm shop',
    description: 'Farm shop in Hilversum. Gift boxes for drinks, dinner or something sweet, or a gift card to choose for yourself.',
    image: 'suppliers/alexanderhoeve/stall.svg',
    color: '#f2c94c',
    packages: stock('alexanderhoeve', [
      ['drinks-and-nibbles', 'Drinks & nibbles', 'Everything for a festive borrel: white wine, dipping oil, bread sticks, honey-mustard dip, aged cheese, two tapenades and tortilla chips.'],
      ['dinner-for-two', 'Dinner for two', 'A cosy winter evening for two: a Boska fondue pot, red wine, tortilla chips and salsa dip.'],
      ['taste-of-italy', 'A taste of Italy', 'Sweet meets savoury: limoncello wine, aged cheese with honey-mustard dip, pita chips and nougat.'],
      ['sweet-moment', 'Sweet moment', 'Tea, honey and Italian sweets to share: nougat, two juices, four pasticcini and two cannoli.'],
      ['gift-card', 'Gift card', 'Choose for yourself: €35 to spend at the farm shop, from a good cheese to your favourite snacks.'],
    ]),
  },
  {
    id: 'olala-chocola',
    name: 'Olala Chocola',
    kind: 'Chocolatier',
    description: 'Handmade bonbons and chocolate gifts. Pick something to unwrap, or make your own bonbons in a workshop.',
    image: 'suppliers/olala-chocola/stall.svg',
    color: '#7b4a2d',
    packages: stock('olala-chocola', [
      ['gift-card', 'Gift card', 'Worth €35, to spend at any Olala Chocola shop.'],
      ['workshop', 'Bonbon workshop', 'Make your own box of 24 bonbons with a chocolatier. Hilversum only; a second person can join for €35.'],
      ['bonbons-750g', 'Big box of bonbons', '750 g of bonbons: a mix of all flavours, alcohol-free, nut-free, or both nut- and alcohol-free.'],
      ['chocolate-box-1', 'Chocolate box 1', 'Nut clusters, butterscotch leaves and a chocolate champagne bottle, in milk or dark.'],
      ['chocolate-box-2', 'Chocolate box 2', '375 g of bonbons, chocolate sprinkles, chocolate pretzels and artisan hazelnut spread, in milk or dark.'],
      ['handbag-and-shoe', 'Handbag & shoe', 'A chocolate handbag (milk or dark) and a chocolate shoe (milk, dark or white).'],
    ]),
  },
  {
    id: 'gastrovino',
    name: 'Gastrovino Mijn Hemel',
    kind: 'Wine shop',
    description: 'Italian wines, organic and alcohol-free. Pick one of three wine gifts, or a gift card.',
    image: 'suppliers/gastrovino/stall.svg',
    color: '#9b2335',
    packages: stock('gastrovino', [
      ['white-wine', 'Fantasia Zibibbo', 'One bottle from Baglio Diar, organic and vegan. A dry, aromatic Sicilian white with peach, rose petals and orange peel. Lovely as an aperitif.'],
      ['red-wine', "Nedda Nero d'Avola", 'One bottle from Baglio Diar, organic. A smooth, juicy Sicilian red with blueberry, blackberry and a hint of spice. Great with pasta, pizza or stews.'],
      ['alcohol-free', 'Alcohol-free duo', 'Two bottles from Franc Lizêr: Rosso 0%, a full Merlot with cherry and raspberry, and Bianco 0%, a fresh Pinot Grigio with apple and peach.'],
      ['gift-card', 'Gift card', 'Spend it at Mijn Hemel.', 'gift-card.svg'],
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
