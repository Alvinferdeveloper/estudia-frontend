
import { BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
    fileName: string;
}

export const Header: React.FC<HeaderProps> = ({ fileName }) => (
    <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-accent" />
                    <h1 className="text-xl font-serif font-bold text-foreground">AI PDF Reader</h1>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <p className="text-sm text-muted-foreground truncate max-w-md">{fileName}</p>
            </div>
        </div>
    </header>
);
