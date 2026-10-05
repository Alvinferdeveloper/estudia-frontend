import { notFound } from "next/navigation";

// Unknown paths render the 404 inside the localized layout instead of Next's unstyled fallback.
export default function CatchAllPage() {
  notFound();
}
