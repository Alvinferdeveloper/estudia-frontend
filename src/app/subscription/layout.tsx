import { QueryProvider } from "@/app/providers/QueryProvider";
export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
