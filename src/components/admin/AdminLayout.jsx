import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminLayout() {
  const location = useLocation();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await api.get("/me"); // adjust if needed
      setAdmin(res.data.data);
    } catch (err) {
      console.error("Failed to fetch admin");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div>
          <h2 className="logo">Admin Panel</h2>

          <nav className="nav">
            <Link
              to="/admin/projects"
              className={
                location.pathname.includes("projects")
                  ? "link active"
                  : "link"
              }
            >
              Projects
            </Link>

            <Link
              to="/admin/tasks"
              className={
                location.pathname.includes("tasks")
                  ? "link active"
                  : "link"
              }
            >
              Tasks
            </Link>
          </nav>
        </div>

        {/* ADMIN INFO */}
        <div className="admin-section">
          {admin && (
            <div className="admin-info">
              <div className="admin-name">{admin.name}</div>
              <div className="admin-email">{admin.email}</div>
            </div>
          )}

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">
        <Outlet />
      </div>

      <style jsx>{`
        .container {
          display: flex;
          height: 100vh;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .sidebar {
          width: 240px;
          background: #111827;
          color: white;
          padding: 25px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .logo {
          margin: 0 0 30px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .link {
          text-decoration: none;
          color: #9ca3af;
          padding: 10px 12px;
          border-radius: 8px;
          transition: 0.2s;
          font-size: 14px;
        }

        .link:hover {
          background: #1f2937;
          color: white;
        }

        .active {
          background: #6366f1;
          color: white;
        }

        .admin-section {
          border-top: 1px solid #1f2937;
          padding-top: 15px;
        }

        .admin-info {
          margin-bottom: 12px;
        }

        .admin-name {
          font-weight: 600;
        }

        .admin-email {
          font-size: 12px;
          color: #9ca3af;
        }

        .logout-btn {
          width: 100%;
          background: #ef4444;
          border: none;
          color: white;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }

        .logout-btn:hover {
          background: #dc2626;
        }

        .content {
          flex: 1;
          background: #f9fafb;
          padding: 30px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}