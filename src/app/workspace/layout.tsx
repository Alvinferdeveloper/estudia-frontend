import { privatePageMetadata } from "@/config/seo";

export const metadata = privatePageMetadata("Mis documentos");

export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
