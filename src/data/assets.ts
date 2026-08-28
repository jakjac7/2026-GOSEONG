const assetPath = (name: string): string => `${import.meta.env.BASE_URL}assets/processed/${name}`;

export const ASSETS = {
  churchArrival: assetPath('bg-church-arrival.webp'),
  threshold: assetPath('bg-threshold.webp'),
  ajayin: assetPath('bg-ajayin.webp'),
  villageFeast: assetPath('bg-village-feast.webp'),
  observatory: assetPath('bg-observatory.webp'),
  churchInterior: assetPath('church-interior.webp'),
  bus: assetPath('bus.webp'),
  tents: assetPath('tents.webp'),
  brickTruck: assetPath('brick-truck.webp'),
  bricks: assetPath('bricks.webp'),
  prayerTeam: assetPath('prayer-team.webp'),
  elders: assetPath('elders.webp'),
  elderYellow: assetPath('elder-yellow.webp'),
  elderGray: assetPath('elder-gray.webp'),
  elderHat: assetPath('elder-hat.webp'),
  mealTable: assetPath('meal-table.webp'),
  feastStage: assetPath('feast-stage.webp'),
  doorProp: assetPath('door-prop.webp'),
  observatoryChurch: assetPath('observatory-church.webp'),
} as const;

export type AssetKey = keyof typeof ASSETS;
