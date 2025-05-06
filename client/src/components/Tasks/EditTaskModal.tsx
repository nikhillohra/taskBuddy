import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Task, ActivityItem } from "@/types/types";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onUpdate: (updatedTask: Task) => void;
}

export default function EditTaskModal({
  isOpen,
  onClose,
  task,
  onUpdate,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"Work" | "Personal">("Work");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Task["status"]>("TO-DO");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form state when modal opens
  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setCategory(task.category);
      setDueDate(task.dueDate);
      setStatus(task.status);
      setImageFile(null);
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleUpdate = () => {
    const now = new Date().toISOString();
    const newLogs: ActivityItem[] = [];

    // Title changed?
    if (title !== task.title) {
      newLogs.push({ message: `You changed title from “${task.title}” to “${title}”`, timestamp: now });
    }

    // Description changed?
    if ((description || "") !== (task.description || "")) {
      newLogs.push({ message: `You updated the description`, timestamp: now });
    }

    // Category changed?
    if (category !== task.category) {
      newLogs.push({ message: `You changed category from ${task.category} to ${category}`, timestamp: now });
    }

    // Due date changed?
    if (dueDate !== task.dueDate) {
      newLogs.push({ message: `You changed due date from ${task.dueDate} to ${dueDate}`, timestamp: now });
    }

    // Status changed?
    if (status !== task.status) {
      newLogs.push({ message: `You changed status from ${task.status} to ${status}`, timestamp: now });
    }

    // Attachment added/removed?
    if (imageFile) {
      newLogs.push({ message: `You uploaded an attachment`, timestamp: now });
    }

    const updatedActivity = [...(task.activity || []), ...newLogs];

    onUpdate({
      ...task,
      title,
      description,
      category,
      dueDate,
      status,
      activity: updatedActivity,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 md:px-4 bg-black/30">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-xl p-4 md:p-6 relative flex flex-col md:flex-row gap-4 md:gap-8">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
          <X size={20} />
        </button>

        {/* Left section */}
        <div className="w-full md:w-[60%] space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#00000021] bg-[#F1F1F15C] rounded-lg px-4 py-2 text-sm"
            placeholder="Task title"
          />

          <div className="relative">
            <textarea
              maxLength={300}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[#00000021] bg-[#F1F1F15C] rounded-lg px-4 py-3 text-sm resize-none pr-16"
              placeholder="Description"
            />
            <span className="absolute bottom-2 right-3 text-xs text-gray-400">
              {description.length}/300
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm mb-1 text-[#00000099]">Category*</label>
              <div className="flex gap-2">
                {(["Work", "Personal"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-1 border rounded-full ${
                      category === cat ? "bg-purple-700 text-white" : ""
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm mb-1 text-[#00000099]">Due on*</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#00000021] bg-[#F1F1F15C] text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm mb-1 text-[#00000099]">Status*</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                className="px-4 py-2 rounded-lg border border-[#00000021] bg-[#F1F1F15C] text-sm"
              >
                <option value="TO-DO">TO-DO</option>
                <option value="IN-PROGRESS">IN-PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          {/* Attachment */}
          <div>
            <label className="block mb-1 text-[#00000099] text-sm">Attachment</label>
            <div
              className="border rounded-xl bg-[#F1F1F15C] border-[#00000021] p-4 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-gray-500">
                Drop files here or{" "}
                <span className="text-blue-600 underline">Upload</span>
              </p>
              {imageFile && (
                <div className="mt-4 relative w-fit mx-auto">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="max-h-32 rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity panel */}
        <div className="w-full md:w-[40%] border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
          <h3 className="text-lg font-semibold mb-4">Activity</h3>
          <ul className="text-sm space-y-3">
            {(task.activity || []).map((log, i) => (
              <li key={i} className="flex justify-between">
                <span>{log.message}</span>
                <span className="text-xs text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="w-full mt-4 flex justify-end gap-4 md:absolute md:bottom-6 md:right-10">
          <button onClick={onClose} className="px-6 py-2 rounded-full border text-sm">
            Cancel
          </button>
          <button onClick={handleUpdate} className="px-6 py-2 rounded-full bg-purple-700 text-white text-sm">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
