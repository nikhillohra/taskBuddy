import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Task } from "@/types/types";
import selectIcon from "@/assets/icons/selected-check.svg";
import crossIcon from "@/assets/icons/cross.svg";

interface BulkActionBarProps {
  selectedCount: number;
  onStatusChange: (status: Task["status"]) => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onStatusChange,
  onDelete,
  onClearSelection,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#1A1C20] text-white shadow-lg border rounded-2xl px-4 py-3 flex gap-2 sm:gap-4 items-center z-50 max-w-full overflow-x-auto">
      <span className="text-nowrap sm:text-sm text-[10px] font-medium border-[0.2px] border-[#FFFFFF] py-2 px-3 rounded-2xl flex items-center gap-2">
        {selectedCount} Task{selectedCount > 1 ? "s" : ""} Selected
        <button onClick={onClearSelection}>
          <img src={crossIcon} alt="Deselect All" className="w-4 h-4" />
        </button>
      </span>

      <button onClick={onClearSelection}>
        <img
          src={selectIcon}
          alt="Selected Icon"
          className="w-5 h-5 cursor-pointer"
        />
      </button>

      <Select onValueChange={(val) => onStatusChange(val as Task["status"])}>
        <SelectTrigger className="w-auto rounded-[40px] h-8 min-w-[4rem] text-white bg-[#8D8A8A24] border-[#FFFFFF] border-[0.5px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="z-50 min-w-[5rem] rounded-xl bg-[#FFF9F9] shadow-md p-1 text-sm border border-[#7B198426]">
          <SelectItem value="TO-DO">TO-DO</SelectItem>
          <SelectItem value="IN-PROGRESS">IN-PROGRESS</SelectItem>
          <SelectItem value="COMPLETED">COMPLETED</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={onDelete}
        className="bg-[#FF353524] border-[#E13838] text-[#E13838] border rounded-[20px] text-sm"
      >
        Delete
      </Button>
    </div>
  );
};

export default BulkActionBar;
