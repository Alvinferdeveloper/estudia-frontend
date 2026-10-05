import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Exam, useUserExams } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Inbox, FlaskConical, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExamHistoryPanel } from "@/app/[locale]/document/[id]/components/exam/ExamHistoryPanel";

const difficultyStyles: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

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
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          setSelectedExam(null);
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <AnimatePresence mode="wait" initial={false}>
          {selectedExam ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.15 }}
            >
              <DialogTitle className="sr-only">{selectedExam.title}</DialogTitle>
              <DialogDescription className="sr-only">Exam history and stats</DialogDescription>
              <ExamHistoryPanel
                exam={selectedExam}
                onBack={() => setSelectedExam(null)}
                onRetake={() => onSelect(selectedExam.id)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.15 }}
            >
              <DialogHeader className="p-4 pb-3">
                <DialogTitle>My Exams</DialogTitle>
                <DialogDescription>
                  View history or re-take a previously saved exam
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
                  <div className="space-y-1">
                    {exams.map((exam) => (
                      <button
                        key={exam.id}
                        onClick={() => setSelectedExam(exam)}
                        className="press-feedback group flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors duration-150 hover:bg-accent/60"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <img src="/svg/crayon.svg" alt="Crayon" className="h-5 w-5 object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] dark:brightness-110" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{exam.title}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                            <span
                              className={cn(
                                "rounded-full px-1.5 py-0.5 font-medium capitalize",
                                difficultyStyles[exam.difficulty] ?? "bg-secondary text-secondary-foreground"
                              )}
                            >
                              {exam.difficulty}
                            </span>
                            <span>{exam.totalQuestions} questions</span>
                            <span>·</span>
                            <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
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
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
