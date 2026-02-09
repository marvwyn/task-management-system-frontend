import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../components/admin/AdminLayout";
import UserLayout from "../components/user/UserLayout";

import ProjectList from "../pages/admin/ProjectList";
import TaskList from "../pages/admin/TaskList";
import Login from "../pages/Login";
import UserDashboard from "../pages/user/UserDashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="projects" element={<ProjectList />} />
          <Route path="tasks" element={<TaskList />} />
        </Route>

        {/* USER ROUTES */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}