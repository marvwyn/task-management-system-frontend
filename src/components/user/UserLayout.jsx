import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function UserLayout() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/me"); // adjust if needed
      setUser(res.data.data);
    } catch (err) {
      console.error("Failed to fetch user");
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
          <h2 className="logo">User Dashboard</h2>

          <nav className="nav">
        
              My Tasks

            {/* Add more user routes here later if needed */}
          </nav>
        </div>

        {/* USER INFO SECTION */}
        <div className="user-section">
          {user && (
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
              <div className="user-role">{user.role}</div>
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

        .user-section {
          border-top: 1px solid #1f2937;
          padding-top: 15px;
        }

        .user-info {
          margin-bottom: 12px;
        }

        .user-name {
          font-weight: 600;
        }

        .user-email {
          font-size: 12px;
          color: #9ca3af;
        }

        .user-role {
          font-size: 12px;
          color: #6366f1;
          margin-top: 4px;
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