import { useUserExams } from "@/app/document/[id]/components/exam/hooks/useExam";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";

interface SavedExamsDialogProps {
  documentId: string;
  onSelect: (examId: string) => void;
  onClose: () => void;
}

export const SavedExamsDialog: React.FC<SavedExamsDialogProps> = ({
  documentId,
  onSelect,
  onClose,
}) => {
  const { data: exams, isLoading } = useUserExams(documentId);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="p-4 pb-3">
          <DialogTitle>My Exams</DialogTitle>
          <DialogDescription>
            Re-take a previously saved exam
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-4 pt-0">
          {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}

          {!isLoading && exams && exams.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No saved exams yet. Create one first.
              </p>
            </div>
          )}

          {!isLoading && exams && exams.length > 0 && (
            <div className="space-y-2">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => onSelect(exam.id)}
                  className="press-feedback w-full rounded-lg border border-border p-3 text-left transition-colors duration-150 hover:border-primary/40"
                >
                  <div className="font-medium">{exam.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {exam.totalQuestions} questions · {exam.difficulty} ·{" "}
                    {new Date(exam.createdAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border p-4">
          <Button variant="outline" className="press-feedback" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
