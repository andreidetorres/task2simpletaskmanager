export interface Task {
  id: string;
  title: string;
  completed: boolean;
  status: "active" | "done";
  createdAt: Date;
  deadline: Date | null;   // ← add this line
}