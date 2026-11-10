import { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import "./App.css";

const DEFAULT_GROUPS = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "complete", title: "Complete" },
];

const INITIAL_TASKS = [
  {
    id: "1",
    groupId: "todo",
    title: "Học React cơ bản",
    description: "Tìm hiểu về State, Props và Effect",
    status: "todo",
  },
  {
    id: "2",
    groupId: "in-progress",
    title: "Làm bài tập Todo App",
    description: "Thực hành các thao tác thêm, sửa, xóa công việc",
    status: "in-progress",
  },
  {
    id: "3",
    groupId: "complete",
    title: "Ôn tập HTML và CSS",
    description: "Tập chia layout giao diện đẹp và rõ ràng",
    status: "complete",
  },
];

export default function App() {
  const [tasks, setTasks] = useState(function () {
    const savedTasks = localStorage.getItem("todo_tasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          return parsedTasks.map(function (task) {
            let initialGroup = task.groupId || task.columnId;
            if (!initialGroup) {
              if (task.id === "1") {
                initialGroup = "todo";
              } else if (task.id === "2") {
                initialGroup = "in-progress";
              } else if (task.id === "3") {
                initialGroup = "complete";
              } else {
                initialGroup = task.status || "todo";
              }
            }
            return {
              ...task,
              groupId: initialGroup,
            };
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    return INITIAL_TASKS;
  });

  useEffect(
    function () {
      localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    },
    [tasks]
  );

  function changeStatus(taskId, newStatus) {
    const updatedTasks = tasks.map(function (task) {
      if (task.id === taskId) {
        return {
          ...task,
          status: newStatus,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-title-area">
          <span className="app-logo">Bear</span>
          <h1 className="app-title">Todo Task</h1>
        </div>

        <div className="header-actions">
          <div className="add-group-form">
            <input
              type="text"
              placeholder="Nhap ten group moi..."
              className="group-input"
            />
            <button type="button" className="add-group-button">
              + Add Group
            </button>
          </div>

          <button type="button" className="add-task-button">
            + Add Task
          </button>
        </div>
      </header>

      <main className="app-main">
        <TaskList
          groups={DEFAULT_GROUPS}
          tasks={tasks}
          changeStatus={changeStatus}
        />
      </main>
    </div>
  );
}
