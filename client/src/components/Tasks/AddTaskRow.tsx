import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import plusIcon from "@/assets/icons/plus-icon.svg";
import unionIcon from "@/assets/icons/union.svg";
import addDateIcon from "@/assets/icons/add-date.svg";

import "react-day-picker/dist/style.css";
import "@/styles/custom-calendar.css";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Task } from "@/types/types";

type Props = {
  onAdd: (task: Omit<Task, "id">) => void;
  onCancel: () => void;
};

const AddTaskRow = ({ onAdd, onCancel }: Props) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<Task["status"] | undefined>(undefined);
  const [category, setCategory] = useState<"Work" | "Personal" | undefined>(
    undefined
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [statusPosition, setStatusPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [categoryPosition, setCategoryPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);
  const statusBtnRef = useRef<HTMLButtonElement>(null);
  const categoryBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const handleSubmit = () => {
    if (!title || !dueDate || !status || !category) return;

    onAdd({
      title,
      dueDate: dueDate.toISOString(),
      status,
      category,
      order: 0,
    });

    setTitle("");
    setDueDate(new Date());
    setStatus(undefined);
    setCategory(undefined);
    setShowCalendar(false);
  };

  const handleDateSelect = (date?: Date) => {
    if (date) {
      setDueDate(date);
      setShowCalendar(false);
    }
  };

  const isAddDisabled = !title || !dueDate || !status || !category;

  return (
    <>
      <div className="grid grid-cols-[40px_30px_24px_1fr_150px_150px_150px_40px] items-center px-4 py-3 border-b bg-[#F1F1F1] text-sm relative">
        <span></span>
        <span></span>
        <span></span>

        {/* Task Title */}
        <div className="flex flex-col">
          <Input
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mr-2 w-40 border-none bg-none shadow-none"
          />
          <div className="flex gap-2 mt-2">
            <Button
              className="text-white bg-[#7B1984] font-[500] rounded-full w-[5rem] h-[2rem] flex items-center justify-center gap-1"
              onClick={handleSubmit}
              disabled={isAddDisabled}
            >
              ADD
              <img
                src={unionIcon}
                alt="unionIcon"
                className="mix-blend-brighten"
              />
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-none"
            >
              CANCEL
            </Button>
          </div>
        </div>

        {/* Due Date */}
        <div
          className="relative flex flex-col items-start gap-1"
          ref={calendarRef}
        >
          <img
            src={addDateIcon}
            alt="Add Due Date"
            className="cursor-pointer"
            onClick={() => setShowCalendar((prev) => !prev)}
          />
          {dueDate && (
            <span className="text-sm text-gray-700">
              {dueDate.toLocaleDateString()}
            </span>
          )}
          {showCalendar && (
            <div className="absolute top-10 left-0 z-20 bg-white shadow-md rounded-md p-2">
              <DayPicker
                mode="single"
                selected={dueDate}
                onSelect={handleDateSelect}
                className="custom-calendar"
              />
            </div>
          )}
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-2 relative">
          {status && <span className="text-gray-700">{status}</span>}
          <button
            ref={statusBtnRef}
            onClick={() => {
              const rect = statusBtnRef.current?.getBoundingClientRect();
              if (rect) {
                setStatusPosition({
                  top: rect.bottom + window.scrollY + 5,
                  left: rect.left,
                });
              }
              setStatusModalOpen(true);
            }}
          >
            <img src={plusIcon} alt="Add Status" />
          </button>
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2 relative">
          {category && <span className="text-gray-700">{category}</span>}
          <button
            ref={categoryBtnRef}
            onClick={() => {
              const rect = categoryBtnRef.current?.getBoundingClientRect();
              if (rect) {
                setCategoryPosition({
                  top: rect.bottom + window.scrollY + 5,
                  left: rect.left,
                });
              }
              setCategoryModalOpen(true);
            }}
          >
            <img src={plusIcon} alt="Add Category" />
          </button>
        </div>
      </div>

      {/* Status Modal */}
      {statusModalOpen && statusPosition && (
        <Modal
          onClose={() => setStatusModalOpen(false)}
          position={statusPosition}
        >
          <div className="flex flex-col gap-2 py-2">
            {["TO-DO", "IN-PROGRESS", "COMPLETED"].map((s) => (
              <Button
              className="border-none  text-start ml-2"
                key={s}
                variant={status === s ? "default" : "outline"}
                onClick={() => {
                  setStatus(s as Task["status"]);
                  setStatusModalOpen(false);
                }}
              >
                {s}
              </Button>
            ))}
          </div>
        </Modal>
      )}

      {/* Category Modal */}
      {categoryModalOpen && categoryPosition && (
        <Modal
          onClose={() => setCategoryModalOpen(false)}
          position={categoryPosition}
        >
          <div className="flex flex-col gap-2 py-2">
            {["WORK", "PERSONAL"].map((c) => (
              <Button
               className="border-none text-start ml-2"
                key={c}
                variant={category === c ? "default" : "outline"}
                onClick={() => {
                  setCategory(c as "Work" | "Personal");
                  setCategoryModalOpen(false);
                }}
              >
                {c}
              </Button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
};

export default AddTaskRow;
