import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware replacements for next/link and next/navigation: they add the /en prefix when needed.
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
