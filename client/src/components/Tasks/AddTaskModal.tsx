import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import "@/styles/custom-calendar.css";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Task } from "@/types/types";
import crossIcon from "@/assets/icons/cross2.svg";
import descriptionIcon from "@/assets/icons/description.svg";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newTask: Omit<Task, "id"> & { description?: string; image?: File }) => void;
}

const AddTaskModal = ({ isOpen, onClose, onCreate }: AddTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Task["status"]>("TO-DO");
  const [category, setCategory] = useState<Task["category"]>("Work");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handles form submission and task creation
  const handleSubmit = async () => {
    if (!title || !dueDate) return;

    const newTask = {
      title,
      dueDate,
      status,
      category,
      description: description.trim(),
      order: 0, 
    };

    onCreate(newTask); 
    onClose();
    resetForm();
  };

  // Resets form fields after submission
  const resetForm = () => {
    setTitle("");
    setDueDate("");
    setStatus("TO-DO");
    setCategory("Work");
    setDescription("");
    setImageFile(null);
  };

  // Close the calendar popup if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Render nothing if the modal is closed
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-[700px] h-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl">Create Task</h2>
          <button onClick={onClose} className="p-1 hover:opacity-70 transition">
            <img src={crossIcon} alt="Close modal" className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Task Title Input */}
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border-[#00000021] bg-[#F1F1F15C] shadow-none"
          />

          {/* Task Description Input */}
          <div className="relative w-full">
            <img
              src={descriptionIcon}
              alt="description icon"
              className="absolute top-2.5 left-3 w-4 h-4 opacity-60 pointer-events-none"
            />
            <textarea
              maxLength={300}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-9 pr-16 pt-2 pb-5 border border-[#00000021] bg-[#F1F1F15C] shadow-none rounded-lg text-sm resize-none placeholder-gray-400"
              placeholder="Description"
            />
            <p className="absolute bottom-2 right-3 text-xs text-gray-500 pointer-events-none">
              {description.length}/300 characters
            </p>
          </div>

          {/* Task Category Selection */}
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="mb-1 text-[#00000099] text-sm font-medium">
                Task Category*
              </p>
              <div className="flex gap-2">
                {["Work", "Personal"].map((cat) => (
                  <button
                    key={cat}
                    className={`px-4 py-2 rounded-full border text-sm ${
                      category === cat
                        ? "bg-slate-600 text-white"
                        : "bg-white border-gray-300 text-black"
                    }`}
                    onClick={() => setCategory(cat as Task["category"])}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date Selection */}
            <div className="flex-1 relative" ref={calendarRef}>
              <label className="block mb-1 text-[#00000099] text-sm font-medium">
                Due on*
              </label>
              <Input
                type="text"
                readOnly
                onClick={() => setIsCalendarOpen((prev) => !prev)}
                value={dueDate ? format(new Date(dueDate), "dd/MM/yyyy") : ""}
                placeholder="DD/MM/YYYY"
                className="rounded-lg border-gray-300 cursor-pointer"
              />
              {isCalendarOpen && (
                <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <DayPicker
                    mode="single"
                    selected={dueDate ? new Date(dueDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setDueDate(date.toISOString());
                        setIsCalendarOpen(false);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Task Status Selection */}
            <div className="flex-1">
              <label className="block mb-1 text-[#00000099] text-sm font-medium">
                Task Status*
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="TO-DO">TO-DO</option>
                <option value="IN-PROGRESS">IN-PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          {/* File Attachment Input */}
          <div>
            <label className="block mb-1 text-[#00000099] text-sm font-medium">
              Attachment
            </label>
            <div
              className="border rounded-xl bg-[#F1F1F15C] border-[#00000021] p-4 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
              />
              <p className="text-sm text-gray-500">
                Drop your files here or{" "}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="text-blue-600 underline cursor-pointer"
                >
                  Update
                </span>
              </p>

              {imageFile && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Attachment preview"
                    className="max-h-40 rounded-lg object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end mt-36 justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-full px-6 py-2"
          >
            CANCEL
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#7B1984] text-white rounded-full px-6 py-2"
          >
            CREATE
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddTaskModal;
