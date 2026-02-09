import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from "@tanstack/react-table";
import api from "../../services/api";
import CreateTaskModal from "./CreateTaskModal";

export default function TaskList() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get("/admin/tasks");
    setData(res.data.data.data);
  };

  const columns = useMemo(
    () => [
      { header: "Title", accessorKey: "title" },

      {
        header: "Description",
        cell: ({ row }) => {
          const desc = row.original.description || "";
          const shortText =
            desc.length > 40 ? desc.substring(0, 40) + "..." : desc;

          return (
            <span title={desc} className="desc-cell">
              {shortText || "—"}
            </span>
          );
        }
      },

      {
        header: "Project",
        accessorFn: (row) => row.project?.name || "—"
      },

      {
        header: "Assigned To",
        accessorFn: (row) => row.user?.name || "—"
      },

      {
        header: "Status",
        cell: ({ row }) => {
          const task = row.original;

          const updateStatus = async (newStatus) => {
            try {
              await api.patch(`/admin/tasks/${task.id}/status`, {
                status: newStatus
              });
              fetchTasks();
            } catch (error) {
              alert(error.response?.data?.message || "Update failed");
            }
          };

          return (
            <select
              className={`status-select status-${task.status}`}
              value={task.status}
              onChange={(e) => updateStatus(e.target.value)}
            >
              <option value="TODO">TODO</option>
              <option value="WIP">WIP</option>
              <option value="DONE">DONE</option>
              <option value="OVERDUE">OVERDUE</option>
            </select>
          );
        }
      },

      {
        header: "Priority",
        cell: ({ row }) => {
          const priority = row.original.priority;

          return (
            <span className={`badge priority-${priority}`}>
              {priority}
            </span>
          );
        }
      },

      { header: "Due Date", accessorKey: "due_date" }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="page-container">
      <div className="header">
        <h2>Tasks</h2>
        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Task
        </button>
      </div>

      <div className="card">
        {data.length === 0 ? (
          <div className="empty-state">No tasks found.</div>
        ) : (
          <table>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
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

      {showModal && (
        <CreateTaskModal
          onClose={() => {
            setShowModal(false);
            fetchTasks();
          }}
        />
      )}

      <style jsx>{`
        .page-container {
          padding: 30px;
          background: #f9fafb;
          min-height: 100vh;
          font-family: system-ui, -apple-system, sans-serif;
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

        tbody tr:hover {
          background: #f9fafb;
        }

        .desc-cell {
          cursor: pointer;
          color: #6b7280;
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

        .status-select {
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: 13px;
        }

        .status-TODO {
          background: #f3f4f6;
        }

        .status-WIP {
          background: #e0f2fe;
        }

        .status-DONE {
          background: #dcfce7;
        }

        .status-OVERDUE {
          background: #fee2e2;
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