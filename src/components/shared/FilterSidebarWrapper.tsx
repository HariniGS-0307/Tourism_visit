import { Suspense } from "react";
import FilterSidebar from "./FilterSidebar";

interface Destination {
  slug: string;
  name: string;
}

export default function FilterSidebarWrapper({ destinations = [] }: { destinations?: Destination[] }) {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-96 animate-pulse" />
      }
    >
      <FilterSidebar destinations={destinations} />
    </Suspense>
  );
}
