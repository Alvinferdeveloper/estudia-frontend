import { Highlight } from "react-pdf-highlighter-extended";
export interface Comment {
    text: string;
}

export interface HighlightObject {
    id: string;
    position: Highlight['position'];
    content: { text?: string; image?: string };
    comment?: Comment;
}

export const fetchHighlights = async (pdfId: string): Promise<HighlightObject[]> => {
    const response = await fetch(`/api/highlights?pdfId=${encodeURIComponent(pdfId)}`);

    if (!response.ok) {
        throw new Error("Failed to fetch highlights");
    }

    return response.json();
};

export const saveHighlight = async (pdfId: string, highlight: HighlightObject): Promise<void> => {
    const response = await fetch("/api/highlights", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfId, highlight }),
    });

    if (!response.ok) {
        throw new Error("Failed to save highlight");
    }
};
