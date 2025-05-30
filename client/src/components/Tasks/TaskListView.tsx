import { useState, useMemo, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { Task } from "@/types/types";

// UI Components
import { Button } from "@/components/ui/Button";
import dueIcon from "@/assets/icons/due-icon.svg";
import notFoundImage from "@/assets/images/notfound.svg";

// Custom Components
import AddTaskRow from "./AddTaskRow";
import EditTaskRow from "./EditTaskRow";
import BulkActionBar from "./BulkActionBar";
import TaskSectionHeader from "./TaskSectionHeader";
import TaskRow from "./TaskRow";
import FilterBar from "./FilterBar";
import AddTaskModal from "@/components/Tasks/AddTaskModal";

// DnD
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Firestore Hook
import { useTasks } from "@/hooks/useTasks";

const TaskListView = () => {
  const { tasks, addTask, editTask, deleteTask } = useTasks();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [category, setCategory] = useState<"all" | "Work" | "Personal">("all");
  const [dueDateOrder, setDueDateOrder] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const debounceSearch = useCallback(
    debounce((val: string) => {
      setDebouncedQuery(val);
    }, 300),
    []
  );

  useEffect(() => {
    debounceSearch(searchQuery);
  }, [searchQuery, debounceSearch]);

  const filteredTasks = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    let result = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(q) ||
        task.dueDate.includes(q) ||
        task.category.toLowerCase().includes(q)
    );

    if (category !== "all") {
      result = result.filter((task) => task.category === category);
    }

    result = result.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dueDateOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [tasks, debouncedQuery, category, dueDateOrder]);

  const groupedTasks: Record<Task["status"], Task[]> = {
    "TO-DO": filteredTasks
      .filter((t) => t.status === "TO-DO")
      .sort((a, b) => a.order - b.order),
    "IN-PROGRESS": filteredTasks
      .filter((t) => t.status === "IN-PROGRESS")
      .sort((a, b) => a.order - b.order),
    COMPLETED: filteredTasks
      .filter((t) => t.status === "COMPLETED")
      .sort((a, b) => a.order - b.order),
  };

  const [collapsedSections, setCollapsedSections] = useState<
    Record<Task["status"], boolean>
  >({
    "TO-DO": false,
    "IN-PROGRESS": false,
    COMPLETED: false,
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    const overTask = tasks.find((t) => t.id === over.id);
    if (!overTask) return;

    const sourceSection = draggedTask.status;
    const targetSection = overTask.status;

    if (sourceSection === targetSection) {
      // Reorder within the same section
      const sectionTasks = groupedTasks[sourceSection];
      const oldIndex = sectionTasks.findIndex((t) => t.id === active.id);
      const newIndex = sectionTasks.findIndex((t) => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newTasks = [...sectionTasks];
        const [movedTask] = newTasks.splice(oldIndex, 1);
        newTasks.splice(newIndex, 0, movedTask);

        // Update order in Firestore
        await Promise.all(
          newTasks.map((task, index) => editTask(task.id, { order: index }))
        );
      }
    } else {
      // Move to a different section
      const sourceTasks = groupedTasks[sourceSection];
      const targetTasks = groupedTasks[targetSection];
      const oldIndex = sourceTasks.findIndex((t) => t.id === active.id);
      const newIndex = targetTasks.findIndex((t) => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedTask = { ...draggedTask, status: targetSection };
        const newTargetTasks = [...targetTasks];
        newTargetTasks.splice(newIndex, 0, updatedTask);

        // Update Firestore: status for the moved task, and order for target section
        await Promise.all([
          editTask(draggedTask.id, { status: targetSection, order: newIndex }),
          ...newTargetTasks
            .map((task, index) =>
              task.id !== draggedTask.id
                ? editTask(task.id, { order: index })
                : null
            )
            .filter(Boolean),
        ]);
      }
    }
  };

  const handleModalCreate = async (
    newTask: Omit<Task, "id"> & { description?: string; image?: File }
  ) => {
    await addTask(newTask);
    setShowAddModal(true);
  };

  const handleAddTask = async (newTask: Omit<Task, "id">) => {
    await addTask(newTask);
    setShowAddTask(false);
  };

  const updateTaskStatus = async (id: string, status: Task["status"]) => {
    await editTask(id, { status });
  };

  const toggleTaskSelection = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-2">
      <FilterBar
        category={category}
        setCategory={setCategory}
        dueDateOrder={dueDateOrder}
        setDueDateOrder={setDueDateOrder}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreateTaskModal={() => setShowAddModal(true)}
      />

      <div className="hidden md:grid-cols-[40px_30px_40px_1fr_200px_200px_200px_40px] sm:grid grid-cols-[40px_30px_24px_1fr_240px_240px_240px_40px] font-semibold text-sm text-gray-600 px-4">
        <span></span>
        <span></span>
        <span></span>
        <span>Task Name</span>
        <span className="flex gap-1 items-center">
          Due on <img src={dueIcon} alt="dueIcon" />
        </span>
        <span>Task Status</span>
        <span>Task Category</span>
        <span></span>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <img
            src={notFoundImage}
            alt="No tasks found"
            className="w-[20rem] h-auto"
          />
        </div>
      ) : (
        <div className="space-y-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {(Object.keys(groupedTasks) as Task["status"][]).map((section) => (
              <div key={section}>
                <TaskSectionHeader
                  section={section}
                  isCollapsed={collapsedSections[section]}
                  count={groupedTasks[section].length}
                  onToggle={() =>
                    setCollapsedSections((prev) => ({
                      ...prev,
                      [section]: !prev[section],
                    }))
                  }
                />

                {!collapsedSections[section] && (
                  <>
                    {section === "TO-DO" && (
                      <div className="px-4 py-3 bg-[#F1F1F1] text-start border-b border-neutral-400">
                        <Button
                          variant="outline"
                          className="font-bold border-none cursor-pointer text-sm"
                          onClick={() => setShowAddTask(true)}
                          disabled={showAddTask}
                        >
                          <span className="text-[#7B1984]">+</span> ADD TASK
                        </Button>
                      </div>
                    )}

                    {section === "TO-DO" && showAddTask && (
                      <AddTaskRow
                        onAdd={handleAddTask}
                        onCancel={() => setShowAddTask(false)}
                      />
                    )}

                    <SortableContext
                      items={groupedTasks[section].map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {groupedTasks[section].map((task) =>
                        editingTask?.id === task.id ? (
                          <EditTaskRow
                            key={task.id}
                            task={editingTask}
                            onCancel={() => setEditingTask(null)}
                            onUpdate={async (updated) => {
                              const { id, ...fields } = updated;
                              await editTask(id, fields);
                              setEditingTask(null);
                            }}
                          />
                        ) : (
                          <TaskRow
                            key={task.id}
                            task={task}
                            section={section}
                            selected={selectedTaskIds.includes(task.id)}
                            onToggleSelect={toggleTaskSelection}
                            onStatusChange={updateTaskStatus}
                            onEdit={setEditingTask}
                            onDelete={async (id) => await deleteTask(id)}
                            highlightQuery={debouncedQuery}
                          />
                        )
                      )}
                    </SortableContext>
                  </>
                )}
              </div>
            ))}
          </DndContext>

          {selectedTaskIds.length > 0 && (
            <BulkActionBar
              selectedCount={selectedTaskIds.length}
              onStatusChange={async (status) => {
                await Promise.all(
                  selectedTaskIds.map((id) => editTask(id, { status }))
                );
                setSelectedTaskIds([]);
              }}
              onDelete={async () => {
                await Promise.all(selectedTaskIds.map((id) => deleteTask(id)));
                setSelectedTaskIds([]);
              }}
              onClearSelection={() => setSelectedTaskIds([])}
            />
          )}
        </div>
      )}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={handleModalCreate}
      />
    </div>
  );
};

export default TaskListView;
