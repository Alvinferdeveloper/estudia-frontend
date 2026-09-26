import { Skeleton } from "@/components/ui/skeleton";

export const PdfSkeleton: React.FC = () => {
    return (
        <div className="flex h-full w-full items-center justify-center bg-muted/30 p-8">
            <div className="flex aspect-[0.77] w-full max-w-md flex-col gap-3 rounded-lg bg-card p-8 shadow-lg shadow-black/5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="mt-4 h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="mt-4 h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/6" />
                <Skeleton className="mt-4 h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/6" />
            </div>
        </div>
    );
};
