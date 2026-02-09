import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from "@tanstack/react-table";
import api from "../../services/api";

export default function MyTasksTable() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchUser();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get("/my-tasks");
    setData(res.data.data.data);
  };

  const fetchUser = async () => {
    const res = await api.get("/me"); // adjust if needed
    setUser(res.data.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/tasks/${id}/status`, { status });
    fetchTasks();
  };

  const columns = useMemo(
    () => [
      {
        header: "Task",
        accessorKey: "title"
      },
      {
        header: "Project",
        accessorFn: (row) => row.project?.name || "—"
      },
      {
        header: "Priority",
        cell: ({ row }) => {
          const p = row.original.priority;
          return <span className={`badge priority-${p}`}>{p}</span>;
        }
      },
      {
        header: "Due Date",
        accessorKey: "due_date"
      },
      {
        header: "Status",
        cell: ({ row }) => {
          const task = row.original;

          const getAllowedTransitions = (current) => {
            switch (current) {
              case "TODO":
                return ["WIP"];
              case "WIP":
                return ["DONE"];
              default:
                return [];
            }
          };

          const allowedStatuses = getAllowedTransitions(task.status);

          const handleChange = async (newStatus) => {
            if (!newStatus || newStatus === task.status) return;

            try {
              await updateStatus(task.id, newStatus);
              setData((prev) =>
                prev.map((t) =>
                  t.id === task.id ? { ...t, status: newStatus } : t
                )
              );
            } catch (error) {
              alert("Status update failed");
            }
          };

          if (task.status === "DONE" || task.status === "OVERDUE") {
            return (
              <span className={`badge status-${task.status}`}>
                {task.status}
              </span>
            );
          }

          return (
            <select
              className="status-select"
              value={task.status}
              onChange={(e) => handleChange(e.target.value)}
            >
              <option value={task.status}>{task.status}</option>
              {allowedStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          );
        }
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="page">
      {/* NAVBAR */}
      <div className="navbar">
        <h3>My Tasks</h3>
      </div>

      {/* TABLE CARD */}
      <div className="card">
        {data.length === 0 ? (
          <div className="empty">No tasks assigned.</div>
        ) : (
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell ??
                          cell.column.columnDef.accessorKey,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .page {
          padding: 30px;
          background: #f9fafb;
          min-height: 100vh;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-info {
          text-align: right;
        }

        .name {
          font-weight: 600;
        }

        .role {
          font-size: 12px;
          color: #6b7280;
        }

        .logout-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }

        .logout-btn:hover {
          background: #dc2626;
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
        }

        td {
          padding: 12px;
          border-top: 1px solid #f1f1f1;
        }

        tbody tr:hover {
          background: #f9fafb;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .priority-LOW {
          background: #dcfce7;
          color: #166534;
        }

        .priority-MEDIUM {
          background: #fef3c7;
          color: #92400e;
        }

        .priority-HIGH {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-DONE {
          background: #dcfce7;
          color: #166534;
        }

        .status-OVERDUE {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-select {
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid #ddd;
        }

        .empty {
          text-align: center;
          padding: 30px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}