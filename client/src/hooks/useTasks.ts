import { useState, useEffect } from "react";
import { db } from "@/services/firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Task } from "@/types/types";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "task-buddy"));
        const tasksData: Task[] = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Task))
          .sort((a, b) => a.order - b.order);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Add a task to Firestore
  const addTask = async (newTask: Omit<Task, "id">) => {
    try {
      const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) : 0;
      const newTaskWithOrder = { ...newTask, order: maxOrder + 1 };
      const docRef = await addDoc(collection(db, "task-buddy"), newTaskWithOrder);
      setTasks((prevTasks) => [...prevTasks, { id: docRef.id, ...newTaskWithOrder }]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Edit a task in Firestore
  const editTask = async (id: string, updatedFields: Partial<Task>) => {
    try {
      const taskRef = doc(db, "task-buddy", id);
      await updateDoc(taskRef, updatedFields);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, ...updatedFields } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task from Firestore
  const deleteTask = async (id: string) => {
    try {
      const taskRef = doc(db, "task-buddy", id);
      await deleteDoc(taskRef);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Reorder tasks in Firestore
  const reorderTasks = async (orderedIds: string[]) => {
    try {
      const updates = orderedIds.map((id, index) =>
        updateDoc(doc(db, "task-buddy", id), { order: index })
      );
      await Promise.all(updates);
      setTasks((prev) =>
        prev.map((task) => ({
          ...task,
          order: orderedIds.indexOf(task.id),
        }))
      );
    } catch (error) {
      console.error("Error reordering tasks:", error);
    }
  };

  return { tasks, loading, addTask, editTask, deleteTask, reorderTasks };
};
