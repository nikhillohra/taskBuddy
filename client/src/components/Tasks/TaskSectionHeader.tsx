import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  section: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  isCollapsed: boolean;
  onToggle: () => void;
  count: number;
};

const TaskSectionHeader = ({ section, isCollapsed, onToggle, count }: SectionHeaderProps) => {
  const color = {
    "TO-DO": "bg-[#FAC3FF]",
    "IN-PROGRESS": "bg-[#85D9F1]",
    COMPLETED: "bg-[#CEFFCC]",
  };

  const bg = {
    "TO-DO": "bg-[#FAC3FF]",
    "IN-PROGRESS": "bg-[#85D9F1]",
    COMPLETED: "bg-[#CEFFCC]",
  };

  return (
    <div
      className={cn("flex rounded-t-2xl justify-between items-center px-4 py-3 font-bold text-sm uppercase cursor-pointer", bg[section])}
      onClick={onToggle}
    >
      <span>{section.replace("-", " ")} ({count})</span>
      {isCollapsed ? (
        <FiChevronDown size={20} className={color[section]} />
      ) : (
        <FiChevronUp size={20} className={color[section]} />
      )}
    </div>
  );
};

export default TaskSectionHeader;
