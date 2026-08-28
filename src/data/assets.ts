const assetPath = (name: string): string => `${import.meta.env.BASE_URL}assets/processed/${name}`;

export const ASSETS = {
  churchArrival: assetPath('bg-church-arrival.webp'),
  threshold: assetPath('bg-threshold.webp'),
  ajayin: assetPath('bg-ajayin.webp'),
  villageFeast: assetPath('bg-village-feast.webp'),
  observatory: assetPath('bg-observatory.webp'),
  churchInterior: assetPath('church-interior.webp'),
  bus: assetPath('travel-bus.webp'),
  pickupSuv: assetPath('pickup-suv-1004.webp'),
  tents: assetPath('tents.webp'),
  brickTruck: assetPath('brick-truck.webp'),
  bricks: assetPath('bricks.webp'),
  prayerTeam: assetPath('prayer-team.webp'),
  elders: assetPath('elders-group.webp'),
  mealPrepTeam: assetPath('meal-prep-team.webp'),
  doorProp: assetPath('door-prop.webp'),
  observatoryChurch: assetPath('observatory-church.webp'),
} as const;

export type AssetKey = keyof typeof ASSETS;
