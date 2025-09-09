import { QueryProvider } from "@/app/providers/QueryProvider";
import { getDocument } from "./actions";
import DocumentClient from "./components/DocumentClient";
import { Document } from "@/app/dashboard/hooks/useDocuments";

export interface DocumentFile extends Document {
  publicUrl: string;
}

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const document = await getDocument(id) as DocumentFile;

  if (!document) {
    return <div>Document not found</div>;
  }

  return (
    <QueryProvider>
      <DocumentClient document={document} />
    </QueryProvider>
  )
}
