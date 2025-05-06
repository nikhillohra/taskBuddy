
// Represents an activity item for a task
export interface ActivityItem {
  message: string;
  timestamp: string; // ISO string or formatted timestamp
}

// Core Task interface
export interface Task {
  id: string;
  title: string;
  dueDate: string; 
  status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
  category: 'Work' | 'Personal';
  description?: string; 
  image?: string | File;
  order: number;
  activity?: ActivityItem[]; 
}

// AddTaskModal Props
export interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newTask: Omit<Task, "id"> & { description?: string; imageUrl?: string }) => Promise<void>;
}

// Task status and category types
export type TaskStatus = 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
export type TaskCategory = 'Work' | 'Personal';

// Task section props
export type TaskSectionProps = {
  section: TaskStatus;
  tasks: Task[];
  collapsed: boolean;
  onToggleCollapse: (section: TaskStatus) => void;
  onAddClick: () => void;
  showAddTask: boolean;
  onAddTask: (newTask: Omit<Task, "id">) => void;
  onCancelAdd: () => void;
  selectedTaskIds: string[];
  onToggleTaskSelection: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
};

// Task section header props
export type TaskSectionHeaderProps = {
  section: TaskStatus;
  count: number;
  collapsed: boolean;
  onToggle: () => void;
};

// Task row props
export type TaskRowProps = {
  task: Task;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onStatusChange: (status: TaskStatus) => void;
};

// Add task row props
export type AddTaskRowProps = {
  onAdd: (newTask: Omit<Task, "id">) => void;
  onCancel: () => void;
};

// Edit task row/modal props
export type EditTaskRowProps = {
  task: Task;
  onCancel: () => void;
  onEdit: (updatedTask: Task) => void;
};

// Task view filter props
export type TaskViewFilterProps = {
  category: string;
  dueDateOrder: string;
  searchQuery: string;
};

// Task card props
export interface TaskCardProps {
  id?: string;
  task: Task;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}
