import { getDocument } from "./actions";
import DocumentClient from "./components/DocumentClient";

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const document = await getDocument(id);

  if (!document) {
    return <div>Document not found</div>;
  }

  return <DocumentClient document={document} />;
}
