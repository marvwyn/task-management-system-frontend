import { useState } from "react";
import CreateProjectModal from "./CreateProjectModal.jsx";
import CreateTaskModal from "./CreateTaskModal.jsx";

export default function AdminDashboard() {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setShowProjectModal(true)} style={btn}>
          + Create Project
        </button>

        <button
          onClick={() => setShowTaskModal(true)}
          style={{ ...btn, marginLeft: "10px" }}
        >
          + Create Task
        </button>
      </div>

      <TaskTable />

      {showProjectModal && (
        <CreateProjectModal onClose={() => setShowProjectModal(false)} />
      )}

      {showTaskModal && (
        <CreateTaskModal onClose={() => setShowTaskModal(false)} />
      )}
    </div>
  );
}

const btn = {
  padding: "8px 15px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};