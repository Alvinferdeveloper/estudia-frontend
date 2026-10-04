import { QueryProvider } from "@/app/providers/QueryProvider";
import { privatePageMetadata } from "@/config/seo";

export const metadata = privatePageMetadata("Planes");

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
