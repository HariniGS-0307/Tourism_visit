import DestinationsGrid from "@/components/listings/DestinationsGrid";

export const metadata = {
  title: "Destinations | MahaAdventures",
  description: "Browse all adventure destinations across Maharashtra.",
};

export default function DestinationsPage() {
  return (
    <DestinationsGrid
      title="All Destinations"
      subtitle="Pick a destination and discover treks, camping, water sports, and more."
    />
  );
}
