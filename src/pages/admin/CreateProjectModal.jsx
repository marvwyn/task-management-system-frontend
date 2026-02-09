import Modal from "react-modal";
import { useState } from "react";
import api from "../../services/api";

Modal.setAppElement("#root");

export default function CreateProjectModal({ onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/admin/projects", { name, description });
      alert("Project created!");
      onClose();
    } catch (err) {
      alert("Something went wrong!");
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
          maxWidth: "500px",
          margin: "auto",
          borderRadius: "12px",
          padding: "30px",
          border: "none",
        },
      }}
    >
      <div className="modal-container">
        <h2>Create New Project</h2>

        <div className="form-group">
          <label>Project Name</label>
          <input
            type="text"
            placeholder="Enter project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Enter project description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="create-btn" onClick={submit} disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
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
        textarea {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        input:focus,
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