/** Verified Unsplash URLs — use auto=format&fit=crop for reliability */

export const DEFAULT_LISTING_IMAGE =
  "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80";

export const DEFAULT_DESTINATION_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80";

export const DESTINATION_IMAGES: Record<string, string> = {
  lonavala:
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
  bhandardara:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  "kaas-plateau":
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
  "harihar-fort":
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
  tarkarli:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  matheran:
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  rajmachi:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
  igatpuri:
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
  igatapuri:
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
  karjat:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
  "malshej-ghat":
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
  harishchandragad:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
  kalsubai:
    "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
  pench:
    "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80",
  "pench-national-park":
    "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80",
  ganpatipule:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  alibaug:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  malvan:
    "https://images.unsplash.com/photo-1559494007-9f5847c49d94?auto=format&fit=crop&w=800&q=80",
  sinhagad:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
  raigad:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
  "tadoba-national-park":
    "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=800&q=80",
  chikhaldara:
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  "lonar-crater-lake":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
};

export const CATEGORY_IMAGES: Record<string, string> = {
  trekking:
    "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
  camping:
    "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80",
  "water-sports":
    "https://images.unsplash.com/photo-1559494007-9f5847c49d94?auto=format&fit=crop&w=800&q=80",
  "wildlife-safari":
    "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=800&q=80",
  cycling:
    "https://images.unsplash.com/photo-1502472584811-0a2f2feb8968?auto=format&fit=crop&w=800&q=80",
  paragliding:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
};

const BROKEN_IMAGE_IDS = [
  "photo-1504280390367",
  "photo-1478131143088",
  "photo-1533872194216",
];

export function isBrokenImageUrl(url: string | null | undefined): boolean {
  if (!url) return true;
  if (url.includes("cloudinary.com/demo")) return true;
  return BROKEN_IMAGE_IDS.some((id) => url.includes(id));
}

export function getDestinationImage(slug: string, heroImageUrl?: string | null): string {
  if (heroImageUrl && !isBrokenImageUrl(heroImageUrl)) return heroImageUrl;
  return DESTINATION_IMAGES[slug] ?? DEFAULT_DESTINATION_IMAGE;
}

export function getCategoryImage(slug: string, icon?: string | null): string {
  if (icon && !isBrokenImageUrl(icon)) return icon;
  return CATEGORY_IMAGES[slug] ?? DEFAULT_LISTING_IMAGE;
}

export function getListingImage(
  images?: string[] | null,
  categorySlug?: string,
  destinationSlug?: string
): string {
  const first = images?.[0];
  if (first && !isBrokenImageUrl(first)) return first;
  if (categorySlug && CATEGORY_IMAGES[categorySlug]) return CATEGORY_IMAGES[categorySlug];
  if (destinationSlug && DESTINATION_IMAGES[destinationSlug]) return DESTINATION_IMAGES[destinationSlug];
  return DEFAULT_LISTING_IMAGE;
}

export const LISTING_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559494007-9f5847c49d94?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
];
