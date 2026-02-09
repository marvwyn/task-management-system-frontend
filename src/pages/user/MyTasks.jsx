import { useEffect, useState } from "react";
import api from "../../services/api";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get("/my-tasks");
    setTasks(res.data.data);
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/tasks/${id}/status`, { status });
    fetchTasks();
  };

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} style={card}>
          <h4>{task.title}</h4>
          <p>Status: {task.status}</p>

          <select onChange={(e) => updateStatus(task.id, e.target.value)}>
            <option value="">Change Status</option>
            <option value="WIP">WIP</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "10px"
};