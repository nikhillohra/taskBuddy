import { format, isToday, parseISO } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import dragIcon from "@/assets/icons/drag-icon.svg";
import checkGrey from "@/assets/icons/check-grey.svg";
import checkGreen from "@/assets/icons/check-green.svg";
import threeDots from "@/assets/icons/three-dots.svg";
import editIcon from "@/assets/icons/edit-icon.svg";
import deleteIcon from "@/assets/icons/delete-icon.svg";

import { Task } from "@/types/types";

interface TaskRowProps {
  task: Task;
  section: Task["status"];
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  highlightQuery?: string;
}

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
    ) : (
      part
    )
  );
};

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  section,
  selected,
  onToggleSelect,
  onStatusChange,
  onEdit,
  onDelete,
  highlightQuery = "",
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
  ref={setNodeRef}
  style={style}
  className="grid grid-cols-[30px_24px_1fr] sm:grid-cols-[40px_30px_24px_1fr_150px_150px_150px_40px] items-center px-4 py-3 border-b-1 border-b-neutral-400 text-sm bg-[#F1F1F1] hover:bg-gray-50"
  {...attributes}
>
  {/* Checkbox */}
  <Checkbox checked={selected} onChange={() => onToggleSelect(task.id)} />

  {/* Drag Icon – hidden on mobile */}
  <img
    src={dragIcon}
    alt="Drag"
    className="w-6 h-6 cursor-grab active:cursor-grabbing hidden sm:block"
    {...listeners}
  />

  {/* Status Icon */}
  <img
    src={section === "COMPLETED" ? checkGreen : checkGrey}
    alt="Status Icon"
    className="w-4 h-4"
  />

  {/* Task Title */}
  <span className={`truncate ${section === "COMPLETED" ? "line-through text-gray-500" : ""}`}>
    {highlightText(task.title, highlightQuery)}
  </span>

  {/* Due Date – hidden on mobile */}
  <span className="hidden sm:block">
    {isToday(parseISO(task.dueDate))
      ? "Today"
      : format(parseISO(task.dueDate), "dd MMM, yyyy")}
  </span>

  {/* Status Selector – hidden on mobile */}
  <div className="hidden sm:block">
    <Select
      value={task.status}
      onValueChange={(val) => onStatusChange(task.id, val as Task["status"])}
    >
      <SelectTrigger className="w-[7rem] h-6 text-center justify-center">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className="z-50 min-w-[5rem] rounded-xl bg-[#FFF9F9] shadow-md p-1 text-sm border border-[#7B198426]">
        <SelectItem value="TO-DO">TO-DO</SelectItem>
        <SelectItem value="IN-PROGRESS">IN-PROGRESS</SelectItem>
        <SelectItem value="COMPLETED">COMPLETED</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Category – hidden on mobile */}
  <span className="hidden sm:block">
    {highlightText(task.category ?? "", highlightQuery)}
  </span>

  {/* Three Dots Menu – hidden on mobile */}
  <div className="hidden sm:block">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="w-6 h-6">
          <img src={threeDots} alt="Options" className="w-6 h-6" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[7rem] rounded-xl bg-[#FFF9F9] border-[#7B198426] border shadow-md p-1 text-sm"
          sideOffset={5}
        >
          <DropdownMenu.Item
            className="cursor-pointer items-center flex px-2 py-2 rounded-sm hover:bg-gray-100"
            onClick={() => onEdit(task)}
          >
            <img src={editIcon} alt="editIcon" className="inline mr-1" />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="cursor-pointer flex items-center px-2 py-2 rounded-sm text-red-500 hover:bg-red-100"
            onClick={() => onDelete(task.id)}
          >
            <img src={deleteIcon} alt="deleteIcon" className="inline mr-1" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </div>
</div>

  );
};

export default TaskRow;
