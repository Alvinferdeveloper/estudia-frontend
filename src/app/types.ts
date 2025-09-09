export interface Document {
    id: string;
    fileName: string;
    filePath: string;
    mimeType: string;
    createdAt: string;
    fileSize: string;
    topicId: string | null;
    tags: string[];
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
