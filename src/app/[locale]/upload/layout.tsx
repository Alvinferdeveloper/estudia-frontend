import { privatePageMetadata } from "@/config/seo";

export const metadata = privatePageMetadata("Subir documento");

export default function UploadLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
