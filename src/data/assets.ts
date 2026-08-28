const assetPath = (name: string): string => `${import.meta.env.BASE_URL}assets/processed/${name}`;
const illustratedPath = (name: string): string =>
  `${import.meta.env.BASE_URL}assets/illustrated/${name}`;

export const ASSETS = {
  churchArrival: assetPath('bg-church-arrival.webp'),
  threshold: assetPath('bg-threshold.webp'),
  ajayin: assetPath('bg-ajayin.webp'),
  villageFeast: assetPath('bg-village-feast.webp'),
  observatory: assetPath('bg-observatory.webp'),
  churchInterior: assetPath('church-interior-open.webp'),
  kyungdongBusStop: illustratedPath('kyungdong-bus-stop.svg'),
  bus: assetPath('travel-bus.webp'),
  pickupSuv: assetPath('pickup-suv-1004.webp'),
  tents: assetPath('canopy-tent.webp'),
  brickTruck: assetPath('brick-truck-loaded.webp'),
  prayerTeam: assetPath('prayer-team.webp'),
  elders: assetPath('elders-group.webp'),
  mealPrepTeam: assetPath('meal-prep-team.webp'),
  outreachVolunteers: illustratedPath('outreach-volunteers.svg'),
  internationalStudents: illustratedPath('international-students.svg'),
  observatoryChurch: assetPath('observatory-church-cutout.webp'),
} as const;

export type AssetKey = keyof typeof ASSETS;
