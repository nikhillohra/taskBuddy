import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/types";
import { format, isToday } from "date-fns";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { Card } from "@/components/ui/Card";
import threeDots from "@/assets/icons/three-dots.svg";
import editIcon from "@/assets/icons/edit-icon.svg";
import deleteIcon from "@/assets/icons/delete-icon.svg";

type Props = {
  id: string;
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export default function SortableTaskCard({ id, task, onEdit, onDelete }: Props) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      cursor: "grab",
    };
  
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="mb-4 relative"
      >
        <Card className="bg-white h-[8rem] p-3 rounded-xl shadow-sm border border-gray-200 text-sm flex flex-col justify-between">
          {/* Top section*/}
          <div className="flex justify-between items-start">
            <div
              className={`font-medium text-base text-gray-800 ${
                task.status === "COMPLETED" ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </div>
  
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="p-1 rounded-full hover:bg-gray-100"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <img src={threeDots} alt="Options" className="w-5 h-5" />
                </button>
              </DropdownMenu.Trigger>
  
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={5}
                  className="z-50 min-w-[7rem] rounded-xl bg-[#FFF9F9] border-[#7B198426] border shadow-md p-1 text-sm"
                >
                  <DropdownMenu.Item asChild>
                    <button
                      className="flex items-center gap-2 px-2 py-2 rounded-sm hover:bg-gray-100 cursor-pointer w-full text-left"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => onEdit(task)}
                    >
                      <img src={editIcon} alt="Edit" className="w-4 h-4" />
                      Edit
                    </button>
                  </DropdownMenu.Item>
  
                  <DropdownMenu.Item asChild>
                    <button
                      className="flex items-center gap-2 px-2 py-2 rounded-sm text-red-500 hover:bg-red-100 cursor-pointer w-full text-left"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => onDelete(task.id)}
                    >
                      <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
                      Delete
                    </button>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
  
          {/* Bottom section: Category and Date */}
          <div className="flex items-center justify-between text-xs text-[#00000085]">
            <span>{task.category}</span>
            {task.dueDate && (
              <span>
                {isToday(new Date(task.dueDate))
                  ? "Today"
                  : format(new Date(task.dueDate), "dd MMM, yyyy")}
              </span>
            )}
          </div>
        </Card>
      </div>
    );
  }
  