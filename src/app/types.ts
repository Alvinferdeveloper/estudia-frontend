export interface Document {
    id: string;
    fileName: string;
    filePath: string;
    mimeType: string;
    createdAt: string;
    fileSize: string;
    topicId: string | null;
    folderId: string | null;
    tags: string[];
    type: 'document';
}

export interface Folder {
    id: string;
    name: string;
    color: string;
    topicId: string | null;
    parentId: string | null;
    createdAt: string;
    count: number;
    subfoldersCount: number;
    type: 'folder';
    subfolders?: Folder[];
    documents?: Document[];
}

export interface Topic {
    id: string;
    name: string;
    color: string;
    count: number;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}

export interface AnnotationRect {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    pageNumber: number;
}

export interface BoundingRect {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    pageNumber: number;
}

export interface Annotation {
    id: string;
    selectedText: string;
    comment: string | null;
    aiResponse: string | null;
    color: string;
    pageNumber: number;
    boundingRect: BoundingRect;
    rects: AnnotationRect[];
    embedding: string | null;
    documentId: string;
    createdAt: string;
    updatedAt: string;
}
