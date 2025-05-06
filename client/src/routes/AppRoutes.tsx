// src/routes/AppRoutes.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "@/pages/Auth/Login";
import TaskBoard from "@/pages/Dashboard/TaskBoard";
import { useAuth } from "@/context/AuthContext";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {!user ? (
        <Route path="/" element={<Login />} />
      ) : (
        <>
          <Route path="/" element={<TaskBoard />} />
        </>
      )}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
