import { useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableTaskCard from "./SortableTaskCard";
import FilterBar from "./FilterBar";
import AddTaskModal from "@/components/Tasks/AddTaskModal";
import EditTaskModal from "./EditTaskModal";

import { Task } from "@/types/types";
import { useTasks } from "@/hooks/useTasks";

import notFoundImage from "@/assets/images/notfound.svg";

type CategoryFilter = "all" | "Work" | "Personal";

export default function TaskBoardView() {
  const { tasks, addTask, editTask, deleteTask } = useTasks();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [dueDateOrder, setDueDateOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columns: Task["status"][] = ["TO-DO", "IN-PROGRESS", "COMPLETED"];

  //SENSORS
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!active || !over || active.id === over.id) return;

    const [fromStatus, fromId] = String(active.id).split("|");
    const [toStatus, toId] = String(over.id).split("|");

    if (!fromId || !toId) return;

    const draggedTask = tasks.find((t) => t.id === fromId);
    if (!draggedTask) return;

    // If column has changed, update status
    if (fromStatus !== toStatus) {
      const { id, ...rest } = draggedTask;
      await editTask(id, { ...rest, status: toStatus as Task["status"] });
    } else {
      // Reordering within the same column
      const columnTasks = tasks
        .filter((t) => t.status === fromStatus)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)); 

      const oldIndex = columnTasks.findIndex((t) => t.id === fromId);
      const newIndex = columnTasks.findIndex((t) => t.id === toId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(columnTasks, oldIndex, newIndex);

      
        for (let i = 0; i < reordered.length; i++) {
          if (reordered[i].order !== i) {
            const { id, ...rest } = reordered[i];
            await editTask(id, { ...rest, order: i });
          }
        }
      }
    }
  };

  const handleModalCreate = async (
    newTask: Omit<Task, "id"> & { description?: string; image?: File }
  ) => {
    await addTask(newTask);
    setShowAddModal(false);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
  };

  const filtered = tasks.filter((task) => {
    const matchCat = category === "all" || task.category === category;
    const matchSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      <FilterBar
        category={category}
        setCategory={setCategory}
        dueDateOrder={dueDateOrder}
        setDueDateOrder={setDueDateOrder}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreateTaskModal={() => setShowAddModal(true)}
      />

      {filtered.length === 0 ? (
        <div className="flex justify-center items-center h-[400px]">
          <img
            src={notFoundImage}
            alt="No tasks found"
            className="w-[20rem] h-auto"
          />
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={(event) => {
            const taskId = String(event.active.id).split("|")[1];
            const task = tasks.find((t) => t.id === taskId);
            if (task) setActiveTask(task); 
          }}
          sensors={sensors} 
        >
          <SortableContext
            items={filtered.map((t) => `${t.status}|${t.id}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
              {columns.map((status) => {
                const columnTasks = filtered
                  .filter((t) => t.status === status)
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

                return (
                  <div
                    key={status}
                    className="bg-[#F1F1F1] border-[#58575112] border p-4 rounded-xl min-h-[300px] transition-all duration-300"
                  >
                    <h2
                      className={`text-base mb-4 px-2 py-1 rounded-md inline-block ${
                        status === "TO-DO"
                          ? "bg-[#FAC3FF]"
                          : status === "IN-PROGRESS"
                          ? "bg-[#85D9F1]"
                          : "bg-[#A2D6A0]"
                      }`}
                    >
                      {status.replace("-", " ")}
                    </h2>
                    {columnTasks.map((task) => (
                      <SortableTaskCard
                        key={`${task.status}|${task.id}`}
                        id={`${task.status}|${task.id}`}
                        task={task}
                        onEdit={setEditingTask}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <DragOverlay>
        {activeTask && (
          <SortableTaskCard
            id={`${activeTask.status}|${activeTask.id}`}
            task={activeTask}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        )}
      </DragOverlay>

      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={async (updatedTask) => {
            const { id, ...updatedFields } = updatedTask;
            await editTask(id, updatedFields);
            setEditingTask(null);
          }}
        />
      )}

      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={handleModalCreate}
      />
    </div>
  );
}
