import { useUserExams } from "@/app/document/[id]/components/exam/hooks/useExam";

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
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/50">
      <div className="bg-card rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">My Exams</h2>
            <p className="text-sm text-muted-foreground">
              Re-take a previously saved exam
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}

          {!isLoading && exams && exams.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No saved exams yet. Create one first.
            </p>
          )}

          {!isLoading && exams && exams.length > 0 && (
            <div className="space-y-2">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => onSelect(exam.id)}
                  className="w-full p-3 rounded-lg border text-left transition-all border-border hover:border-accent/50 hover:bg-accent/10"
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

        <div className="p-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
