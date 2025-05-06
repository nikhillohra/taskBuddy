import { useState } from "react";
import TaskListView from "@/components/Tasks/TaskListView";
import TaskBoardView from "@/components/Tasks/TaskBoardView";
import Header from "@/components/Tasks/Header";

/*** TaskBoard Component */
export default function TaskBoard() {
  const [view, setView] = useState<"list" | "board">("list");

  return (
    <div className="min-h-screen sm:p-6">
      
      {/* Header section*/}
      <div className="bg-[#FAEEFC] sm:bg-white p-4 shadow-[#00000040]">
        <Header currentView={view} setView={setView} />
      </div>
      
      {/* Conditional rendering*/}
      <div className="sm:mt-3 px-2">
        {view === "list" ? <TaskListView /> : <TaskBoardView />}
      </div>
    </div>
  );
}
