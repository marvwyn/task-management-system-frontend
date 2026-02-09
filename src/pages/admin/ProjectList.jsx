import { useEffect, useState } from "react";
import api from "../../services/api";
import CreateProjectModal from "./CreateProjectModal";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await api.get("/admin/projects");
    setProjects(res.data.data);
  };

  return (
    <div className="page-container">
      <div className="header">
        <h2>Projects</h2>
        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Project
        </button>
      </div>

      <div className="card">
        {projects.length === 0 ? (
          <div className="empty-state">
            No projects found.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className="project-name">{p.name}</td>
                  <td>{p.description || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => {
            setShowModal(false);
            fetchProjects();
          }}
        />
      )}

      <style jsx>{`
        .page-container {
          padding: 30px;
          font-family: system-ui, -apple-system, sans-serif;
          background: #f9fafb;
          min-height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h2 {
          margin: 0;
          font-size: 22px;
        }

        .add-btn {
          background: #6366f1;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: 0.2s;
        }

        .add-btn:hover {
          background: #4f46e5;
          transform: translateY(-1px);
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 20px;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #f3f4f6;
        }

        th {
          text-align: left;
          padding: 12px;
          font-size: 14px;
          color: #374151;
        }

        td {
          padding: 12px;
          font-size: 14px;
          border-top: 1px solid #f1f1f1;
        }

        tbody tr {
          transition: background 0.2s ease;
        }

        tbody tr:hover {
          background: #f9fafb;
        }

        .project-name {
          font-weight: 500;
          color: #111827;
        }

        .empty-state {
          text-align: center;
          padding: 30px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}