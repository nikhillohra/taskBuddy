import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { ChevronDown, Search } from "lucide-react";
import { Task } from "@/types/types";

type CategoryFilter = "all" | Task["category"];

interface FilterBarProps {
  category: CategoryFilter;
  setCategory: (val: CategoryFilter) => void;
  dueDateOrder: string;
  setDueDateOrder: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onOpenCreateTaskModal: () => void;
}

const FilterBar = ({
  category,
  setCategory,
  dueDateOrder,
  setDueDateOrder,
  searchQuery,
  setSearchQuery,
  onOpenCreateTaskModal,
}: FilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 px-6 py-4 border-b border-neutral-200">
      {/* Add Task (mobile) */}
      <div className="flex sm:hidden justify-end">
        <Button
          onClick={onOpenCreateTaskModal}
          className="rounded-full bg-[#7B1984] text-white px-6"
        >
          ADD TASK
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center text-sm">
        <label className="font-medium text-[#00000099]">Filter by:</label>

        <div className="flex gap-2 mt-2 sm:mt-0">
          {/* Category */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[110px] h-8 rounded-full bg-white border border-[#00000033] px-3 text-sm text-[#00000099] flex items-center justify-center">
              <SelectValue placeholder="Category" />
              <ChevronDown className="h-4 text-[#00000099]" />
            </SelectTrigger>
            <SelectContent className="z-50 min-w-[5rem] rounded-xl bg-[#FFF9F9] shadow-md p-1 text-sm border border-[#7B198426]">
              <SelectItem value="all">ALL</SelectItem>
              <SelectItem value="Work">WORK</SelectItem>
              <SelectItem value="Personal">PERSONAL</SelectItem>
            </SelectContent>
          </Select>

          {/* Due Date */}
          <Select value={dueDateOrder} onValueChange={setDueDateOrder}>
            <SelectTrigger className="w-[130px] h-8 rounded-full bg-white border border-[#00000033] px-2 py-4 text-sm text-[#00000099] flex items-center justify-center">
              <SelectValue placeholder="Due Date" />
              <ChevronDown className="h-4 text-[#00000099]" />
            </SelectTrigger>
            <SelectContent className="z-50 min-w-[5rem] rounded-xl bg-[#FFF9F9] shadow-md p-1 text-sm border border-[#7B198426]">
              <SelectItem value="asc">DUE DATE ↑</SelectItem>
              <SelectItem value="desc">DUE DATE ↓</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search and Add (desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-64 rounded-full border border-[#0000006B]"
          />
        </div>
        <div className="hidden sm:flex">
          <Button
            onClick={onOpenCreateTaskModal}
            className="rounded-full bg-[#7B1984] text-white px-6"
          >
            ADD TASK
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
