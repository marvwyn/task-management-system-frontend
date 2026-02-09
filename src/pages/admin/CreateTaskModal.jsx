import Modal from "react-modal";
import { useEffect, useState } from "react";
import api from "../../services/api";

Modal.setAppElement("#root");

export default function CreateTaskModal({ onClose }) {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    project_id: "",
    assigned_to: "",
    title: "",
    description: "",
    priority: "MEDIUM",
    due_date: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.data);
    } catch (err) {
      alert("Failed to load users");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/admin/projects");
      setProjects(res.data.data);
    } catch (err) {
      alert("Failed to load projects");
    }
  };

  const submit = async () => {
    if (!form.title.trim()) {
      alert("Task title is required");
      return;
    }

    if (!form.project_id) {
      alert("Please select a project");
      return;
    }

    if (!form.assigned_to) {
      alert("Please select a user");
      return;
    }

    if (!form.due_date) {
      alert("Please select due date");
      return;
    }

    try {
      setLoading(true);
      await api.post("/admin/tasks", form);
      alert("Task created successfully!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        },
        content: {
          maxWidth: "520px",
          margin: "auto",
          borderRadius: "12px",
          padding: "30px",
          border: "none",
        },
      }}
    >
      <div className="modal-container">
        <h2>Create New Task</h2>

        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Enter task description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        {/* Project */}
        <div className="form-group">
          <label>Project</label>
          <select
            value={form.project_id}
            onChange={(e) =>
              setForm({ ...form, project_id: e.target.value })
            }
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assign User */}
        <div className="form-group">
          <label>Assign To</label>
          <select
            value={form.assigned_to}
            onChange={(e) =>
              setForm({ ...form, assigned_to: e.target.value })
            }
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="form-group">
          <label>Priority</label>
          <select
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={form.due_date}
            onChange={(e) =>
              setForm({ ...form, due_date: e.target.value })
            }
          />
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button
            className="create-btn"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        h2 {
          margin: 0;
          text-align: center;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        input,
        select,
        textarea {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
          transition: all 0.2s ease;
          background: white;
        }

        textarea {
          min-height: 90px;
          resize: vertical;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .button-group {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }

        .cancel-btn {
          background: #f3f4f6;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .create-btn {
          background: #6366f1;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }

        .create-btn:hover {
          background: #4f46e5;
        }

        .create-btn:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }
      `}</style>
    </Modal>
  );
}