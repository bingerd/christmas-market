// The catalogue: charities, suppliers and what's on offer at each stall.
// `image` is a path inside src/images/. Photos are 4:3 JPEGs; pixel-art
// placeholders (SVG) can be generated with scripts/make-placeholders.ts.

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
    description: "Craft brewery in a 17th-century farmhouse in Almkerk, named after the village's old courthouse. Their tripel Scheepstimmerman won gold at the Dutch Beer Challenge 2024. Take home a box of their beers, or a gift card for the taproom next to the brewery.",
    image: 'suppliers/de-magistraat/stall.svg',
    color: '#3d9be0',
    packages: stock('de-magistraat', [
      ['beer-box-extras', 'Beer box with extras', 'Seven special beers, from fruity blond and weizen to IPA, dubbel and tripel, plus a metal sign and a De Magistraat beer glass.'],
      ['twelve-beers', 'Big beer box', 'Twelve different special beers from De Magistraat, whose range runs from a fruity blond and a weizen to an IPA, a tripel and a 10% quadrupel.'],
      ['barrel-aged', 'Barrel-aged box', 'Three barrel-aged beers, two of them new secret releases, plus two of their core beers. Barrel-aged beers rest for months in barrels that held wine or spirits, which gives them extra depth.'],
      ['gift-card', 'Gift card', 'Spend it in the taproom next to the brewery in Almkerk, on drinks, lunch or dinner. Not valid in the webshop.'],
    ]),
  },
  {
    id: 'balthazar',
    name: 'Balthazar',
    kind: 'Kitchen shop',
    description: 'Award-winning kitchen shop in Hilversum, full of cookware, tableware, delicatessen and cooking gifts. In 2025 it was one of five shops worldwide honoured for retail excellence at the IHA Global Innovation Awards.',
    image: 'suppliers/balthazar/stall.svg',
    color: '#2e7d4f',
    packages: stock('balthazar', [
      ['pasta-machine', 'Pasta machine', 'Stainless steel pasta machine with a hand crank and a table clamp. Roll out sheets for lasagne, then cut them into fresh tagliatelle or thin tagliolini.'],
      ['teak-board', 'Teak cutting board', 'A sturdy board of FSC-certified teak, 40 × 30 cm, with a groove around the edge that catches the juices when you carve meat or cut fruit.'],
      ['fibre-board', 'Black fibre cutting board', 'Combekk board of recycled paper fibres, pressed into a hard surface that is kind to your knives. 28 × 38 cm, 6 mm thick and dishwasher safe. Dutch design from Breda.'],
      ['chef-knife', "Sabatier chef's knife", "The Integra chef's knife from Diamant Sabatier, a knife maker from Thiers in France. Stainless steel, with dimples in the blade so food doesn't stick, and a riveted black handle."],
      ['even-simpel', 'Cookbook: Even Simpel', 'The Dutch edition of Ottolenghi Simple Too (2026): 135 new recipes for breakfast, lunch, dinner and dessert, each one quick, made in one pot or easy to prep ahead.'],
      ['toscanini', 'Cookbook: Toscanini Pasta', 'Pasta from every region of Italy, by the owners of Toscanini, the Italian restaurant in the Jordaan in Amsterdam: quick weeknight dishes, stuffed pasta, lasagne and ragù. In Dutch.'],
      ['cheese-plates', 'Cheese plates', 'Four ceramic plates printed with vintage cheese labels (Gruyère, Brie, Chevrotin and Camembert), in a round gift box. Made for serving a cheese board.'],
      ['mandoline', 'Mandoline slicer', 'Taylors Eye Witness slicer that adjusts from 0 to 9 mm, with julienne blades for fries and matchsticks. Comes with a finger guard and folds flat for storage.'],
      ['spiegelau-red', 'Spiegelau red wine glasses', 'Four Spiegelau Salute red wine glasses in crystal glass, with a large bowl that gives red wine room to breathe. Dishwasher safe.'],
      ['spiegelau-white', 'Spiegelau white wine glasses', 'Four Spiegelau Salute white wine glasses (465 ml) in crystal glass, made for fresh, aromatic whites. Dishwasher safe.'],
      ['spiegelau-champagne', 'Spiegelau champagne flutes', 'Four Spiegelau Salute flutes (210 ml) in crystal glass, made for Champagne, Prosecco and other sparkling wines. Dishwasher safe.'],
      ['bundt-nove', 'Bundt tin Nove', 'Patisse bundt tin with a swirled design, in cast aluminium with a non-stick coating. Ø 24 cm, enough for 9 to 12 slices, and oven safe up to 230 °C.'],
      ['bundt-star', 'Bundt tin Star', 'Patisse bundt tin with a crown of sharp, star-like ridges, in cast aluminium with a non-stick coating. Ø 24 cm, from the Dutch bakeware maker.'],
      ['bundt-classic', 'Bundt tin Classic', 'The classic fluted ring from Patisse, in cast aluminium with a non-stick coating. Ø 24 cm, for a traditional tulband or any other bundt cake.'],
      ['fondue-set', 'Fondue set Aspen', 'Cosy&Trendy fondue set in red cast iron for 4 people, with a burner and 4 forks. For cheese, chocolate or meat fondue, and the pot also works on induction.'],
      ['grater-dish', 'Alhambra grater dish', 'Handmade and hand-painted ceramic dish from Spain. Rub garlic or ginger over the raised teeth in the middle and the paste collects in the bowl.'],
      ['roll-holder-robin', 'Kitchen roll holder Robin', 'Wildlife Garden kitchen roll holder in solid wood, topped with a hand-carved robin painted in non-toxic paint. 31 cm tall, designed in Sweden.'],
      ['roll-holder-wren', 'Kitchen roll holder Wren', 'The same solid-wood holder from Wildlife Garden, topped with a hand-carved, hand-painted wren. Designed in Sweden.'],
      ['surprise-bag', 'Surprise bag', 'A Balthazar tote bag filled with €50 worth of surprises picked from the shop. The bag is yours to keep.'],
      ['gift-card', 'Gift card', 'Worth €35, to spend in the shop in Hilversum or in the webshop, on anything from pans and knives to delicatessen.'],
    ]),
  },
  {
    id: 'alexanderhoeve',
    name: 'Alexanderhoeve',
    kind: 'Cheese shop',
    description: 'Cheese shop in Hilversum from Alexanderhoeve, a cheese business that started on a farm near Woerden. Dutch and foreign cheeses, freshly roasted nuts, wine and Italian treats. Pick a gift box for drinks, dinner or something sweet, or a gift card to choose for yourself.',
    image: 'suppliers/alexanderhoeve/stall.svg',
    color: '#f2c94c',
    packages: stock('alexanderhoeve', [
      ['drinks-and-nibbles', 'Drinks & nibbles', 'Everything for a festive borrel: pour a glass of white wine, cut into the aged cheese and share crunchy snacks with dips. With white wine, dipping oil, bread sticks, honey-mustard dip, a wedge of aged cheese, two tapenades and tortilla chips.'],
      ['dinner-for-two', 'Dinner for two', 'For cosy winter evenings for two. The Boska fondue pot is the perfect excuse for a long dinner, and red wine, tortilla chips and salsa dip make the evening even better.'],
      ['taste-of-italy', 'A taste of Italy', 'A festive mix of sweet and savoury: limoncello wine, a wedge of aged cheese with honey-mustard dip and crunchy pita chips, with a piece of nougat to finish.'],
      ['sweet-moment', 'Sweet moment', 'Take a moment for something sweet: brew a pot of tea, add honey to taste and share Italian sweets. With nougat, two juices, honey, tea, four pasticcini and two cannoli.'],
      ['gift-card', 'Gift card', 'Choose for yourself: an Alexanderhoeve gift card worth €35, to spend in the shop on anything from a good cheese to your favourite snacks.'],
    ]),
  },
  {
    id: 'olala-chocola',
    name: 'Olala Chocola',
    kind: 'Chocolatier',
    description: 'Chocolatier with 18 ateliers, one of them in Hilversum. Each atelier makes its own bonbons from Belgian chocolate in an open kitchen where you can watch. Pick something to unwrap, or make your own bonbons in a workshop.',
    image: 'suppliers/olala-chocola/stall.svg',
    color: '#7b4a2d',
    packages: stock('olala-chocola', [
      ['gift-card', 'Gift card', 'Worth €35, to spend at any of the 18 Olala Chocola ateliers in the Netherlands.'],
      ['workshop', 'Bonbon workshop', 'Make your own box of 24 bonbons, guided by a chocolatier in the Hilversum atelier, and take them home. A second person can join for €35.'],
      ['bonbons-750g', 'Big box of bonbons', '750 g of bonbons, made in the atelier from Belgian chocolate. Choose a mix of all flavours, alcohol-free, nut-free, or both nut- and alcohol-free.'],
      ['chocolate-box-1', 'Chocolate box 1', 'A champagne bottle made entirely of chocolate, with nut clusters and butterscotch leaves. Everything in milk or dark chocolate.'],
      ['chocolate-box-2', 'Chocolate box 2', 'Breakfast and dessert sorted: 375 g of bonbons (same choices as the big box), chocolate sprinkles, chocolate pretzels and artisan hazelnut spread. Everything in milk or dark chocolate.'],
      ['handbag-and-shoe', 'Handbag & shoe', 'Two chocolate showpieces: a handbag in milk or dark chocolate and a high-heeled shoe in milk, dark or white.'],
    ]),
  },
  {
    id: 'gastrovino',
    name: 'Gastrovino Mijn Hemel',
    kind: 'Wine shop',
    description: 'Wine shop and wine café in Hilversum since 1995, part of Gastrovino, a group of independent wine shops. They focus on small, independent growers. Pick one of three Italian wine gifts, or a gift card.',
    image: 'suppliers/gastrovino/stall.svg',
    color: '#9b2335',
    packages: stock('gastrovino', [
      ['white-wine', 'Fantasia Zibibbo', 'One bottle from Baglio DiAr, an organic and vegan family winery near Marsala in Sicily. A dry, aromatic white from Zibibbo grapes with peach, rose petals and orange peel. Lovely as an aperitif.'],
      ['red-wine', "Nedda Nero d'Avola", "One bottle from Baglio DiAr in Sicily, organic. A smooth, juicy Nero d'Avola with blueberry, blackberry and a hint of spice, aged five months in oak. Great with pasta, pizza or stews."],
      ['alcohol-free', 'Alcohol-free duo', 'Two bottles from Franc Lizêr, the alcohol-free label of a Friulian winery: Rosso 0%, a full Merlot with cherry and raspberry, and Bianco 0%, a fresh Pinot Grigio with apple and peach. Made as real wine, then the alcohol is gently removed.'],
      ['gift-card', 'Gift card', 'Spend it at the Mijn Hemel wine shop in Hilversum, on wines from small growers, delicatessen or gifts.'],
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
