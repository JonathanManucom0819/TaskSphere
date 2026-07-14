import { useEffect, useState } from "react";
import axios from "axios";
import "./TaskList.css";

function TaskList() {
  const [tasks, setTasks] =useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("NEWEST");

  const API_URL = "http://127.0.0.1:8000/api/tasks/";

  const fetchTasks = () => {
    axios
      .get(API_URL)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setEditingTaskId(null);
    setIsEditing(false);
  };

const filteredTasks = tasks
  .filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    switch (sortOption) {
      case "NEWEST":
        return new Date(b.created_at) - new Date(a.created_at);

      case "OLDEST":
        return new Date(a.created_at) - new Date(b.created_at);

      case "AZ":
        return a.title.localeCompare(b.title);

      case "ZA":
        return b.title.localeCompare(a.title);

      default:
        return 0;
    }
  });

  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
  (task) => task.status === "TODO"
  ).length;

  const inProgressTasks = tasks.filter(
  (task) => task.status === "IN_PROGRESS"
  ).length;

  const completedTasks = tasks.filter(
  (task) => task.status === "COMPLETED"
  ).length;

  const addTask = () => {
    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    axios
      .post(API_URL, {
        title,
        description,
        status,
      })
      .then(() => {
        clearForm();
        fetchTasks();
      })
      .catch((error) => console.error(error));
  };

  const updateTask = () => {
    axios
      .put(`${API_URL}${editingTaskId}/`, {
        title,
        description,
        status,
      })
      .then(() => {
        clearForm();
        fetchTasks();
      })
      .catch((error) => console.error(error));
  };

  const deleteTask = (id) => {
    if (!window.confirm("Delete this task?")) return;

    axios
      .delete(`${API_URL}${id}/`)
      .then(() => fetchTasks())
      .catch((error) => console.error(error));
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "TODO":
        return "bg-warning text-dark";
      case "IN_PROGRESS":
        return "bg-primary";
      case "COMPLETED":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "TODO":
        return "To Do";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="container py-5">

      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">
          TaskSphere
        </h1>

        <p className="text-muted fs-5">
          Manage your daily tasks efficiently
        </p>
      </div>

<div className="row mb-5">

  <div className="col-md-3 mb-3">
    <div className="card text-center shadow-sm border-0 dashboard-card">
      <div className="card-body">
        <h6 className="text-muted">Total Tasks</h6>
        <h2 className="fw-bold text-dark">{totalTasks}</h2>
      </div>
    </div>
  </div>

  <div className="col-md-3 mb-3">
    <div className="card text-center shadow-sm border-0 dashboard-card">
      <div className="card-body">
        <h6 className="text-warning">To Do</h6>
        <h2 className="fw-bold text-warning">{todoTasks}</h2>
      </div>
    </div>
  </div>

  <div className="col-md-3 mb-3">
    <div className="card text-center shadow-sm border-0 dashboard-card">
      <div className="card-body">
        <h6 className="text-primary">In Progress</h6>
        <h2 className="fw-bold text-primary">{inProgressTasks}</h2>
      </div>
    </div>
  </div>

  <div className="col-md-3 mb-3">
    <div className="card text-center shadow-sm border-0 dashboard-card">
      <div className="card-body">
        <h6 className="text-success">Completed</h6>
        <h2 className="fw-bold text-success">{completedTasks}</h2>
      </div>
    </div>
  </div>

</div>

      <div className="card shadow-lg mb-5">

        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            {isEditing ? "Update Task" : "Add New Task"}
          </h4>
        </div>

        <div className="card-body">

          <div className="mb-3">
            <label className="form-label fw-bold">
              Task Title
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Description
            </label>

            <textarea
              rows="4"
              className="form-control"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">
              Status
            </label>

            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="d-flex gap-2">

            <button
              className={`btn ${
                isEditing ? "btn-primary" : "btn-success"
              }`}
              onClick={isEditing ? updateTask : addTask}
            >
              {isEditing ? "Update Task" : "Add Task"}
            </button>

            {isEditing && (
              <button
                className="btn btn-secondary"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}

          </div>

        </div>
      </div>

<div className="quick-filter d-flex flex-wrap gap-2">

  <button
    className={`btn ${
      statusFilter === "ALL"
        ? "btn-dark"
        : "btn-outline-dark"
    }`}
    onClick={() => setStatusFilter("ALL")}
  >
    All
  </button>

  <button
    className={`btn ${
      statusFilter === "TODO"
        ? "btn-warning"
        : "btn-outline-warning"
    }`}
    onClick={() => setStatusFilter("TODO")}
  >
    To Do
  </button>

  <button
    className={`btn ${
      statusFilter === "IN_PROGRESS"
        ? "btn-primary"
        : "btn-outline-primary"
    }`}
    onClick={() => setStatusFilter("IN_PROGRESS")}
  >
    In Progress
  </button>

  <button
    className={`btn ${
      statusFilter === "COMPLETED"
        ? "btn-success"
        : "btn-outline-success"
    }`}
    onClick={() => setStatusFilter("COMPLETED")}
  >
    Completed
  </button>

</div>

<div className="row mb-4">

  <div className="col-md-5">

  <label className="form-label fw-bold">
    Search Tasks
  </label>

<div className="input-group">

  <span className="input-group-text">
    <i className="bi bi-search"></i>
  </span>

  <input
    type="text"
    className="form-control"
    placeholder="Search by title..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <button
    className="btn btn-outline-secondary"
    type="button"
    onClick={() => setSearchTerm("")}
  >
    <i className="bi bi-x-circle"></i> Clear
  </button>

</div>

</div>

  <div className="col-md-3">

    <label className="form-label fw-bold">
      Filter by Status
    </label>

    <select
      className="form-select"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="ALL">All Statuses</option>
      <option value="TODO">To Do</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="COMPLETED">Completed</option>
    </select>

  </div>

  <div className="col-md-4">

    <label className="form-label fw-bold">
      Sort By
    </label>

    <select
      className="form-select"
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
    >
      <option value="NEWEST">Newest First</option>
      <option value="OLDEST">Oldest First</option>
      <option value="AZ">Title (A–Z)</option>
      <option value="ZA">Title (Z–A)</option>
    </select>

  </div>

</div>

<h2 className="mb-4">
  Task List ({filteredTasks.length})
</h2>

    {filteredTasks.length === 0 ? (
        <div className="alert alert-warning">
            No matching tasks found.
        </div>
  
      ) : (
        <div className="row">

          {filteredTasks.map((task) => (
            <div className="col-lg-6 mb-4" key={task.id}>
                {/* Task card */}
              <div className="card shadow task-card h-100">

                <div className="card-body">

                  <h4 className="card-title fw-bold">
                    {task.title}
                  </h4>

                  <p className="card-text">
                    {task.description || "No description provided."}
                  </p>

                  <span className={`badge ${getBadgeClass(task.status)}`}>
                    {getStatusLabel(task.status)}
                  </span>

                </div>

                <div className="card-footer bg-white border-0">

                  <div className="d-flex justify-content-end gap-2">

                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        setEditingTaskId(task.id);
                        setTitle(task.title);
                        setDescription(task.description);
                        setStatus(task.status);
                        setIsEditing(true);

                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default TaskList;