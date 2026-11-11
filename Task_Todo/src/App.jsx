import { useState, useEffect } from "react";
import TaskListContainer from "./container/TaskListContainer";
import TaskModalContainer from "./container/TaskModalContainer";
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
  const [groups, setGroups] = useState(function () {
    const savedGroups = localStorage.getItem("todo_groups");
    if (savedGroups) {
      try {
        const parsed = JSON.parse(savedGroups);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.error(err);
      }
    }
    return DEFAULT_GROUPS;
  });

  const [newGroupTitle, setNewGroupTitle] = useState("");

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("todo");

  useEffect(
    function () {
      localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    },
    [tasks],
  );

  useEffect(
    function () {
      localStorage.setItem("todo_groups", JSON.stringify(groups));
    },
    [groups],
  );

  const [editingTask, setEditingTask] = useState(null);

  function handleOpenModal(groupId) {
    setEditingTask(null);
    setSelectedGroupId(groupId || groups[0]?.id || "todo");
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingTask(null);
  }

  function handleOpenEditModal(task) {
    setEditingTask(task);
    setSelectedGroupId(task.groupId || task.status);
    setIsModalOpen(true);
  }

  function handleAddTask(newTask) {
    const taskToAdd = {
      ...newTask,
      id: newTask.id || Date.now().toString(),
    };
    setTasks(function (prev) {
      return [...prev, taskToAdd];
    });
  }

  function handleUpdateTask(updatedTask) {
    setTasks(function (prev) {
      return prev.map(function (item) {
        return item.id === updatedTask.id ? updatedTask : item;
      });
    });
  }

  function handleChangeStatus(taskId, newStatus) {
    const updatedTasks = tasks.map(function (task) {
      if (task.id === taskId) {
        return {
          ...task,
          status: newStatus,
          groupId: newStatus,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function handleDeleteTask(taskId) {
    setTasks(function (prev) {
      return prev.filter(function (task) {
        return task.id !== taskId;
      });
    });
  }

  function handleAddGroup(event) {
    event.preventDefault();
    const trimmed = newGroupTitle.trim();
    if (!trimmed) return;

    const id = trimmed.toLowerCase().replace(/\s+/g, "-");
    const finalId = groups.some(function (g) {
      return g.id === id;
    })
      ? `${id}-${Date.now()}`
      : id;

    const newGroup = {
      id: finalId,
      title: trimmed,
    };

    setGroups(function (prev) {
      return [...prev, newGroup];
    });
    setNewGroupTitle("");
  }
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-title-area">
          <span className="app-logo">Bear</span>
          <h1 className="app-title">Todo Task</h1>
        </div>

        <div className="header-actions">
          <form className="add-group-form" onSubmit={handleAddGroup}>
            <input
              type="text"
              placeholder="Nhap ten group moi..."
              className="group-input"
              value={newGroupTitle}
              onChange={function (e) {
                setNewGroupTitle(e.target.value);
              }}
            />
            <button type="submit" className="add-group-button">
              + Add Group
            </button>
          </form>

          <button
            type="button"
            className="add-task-button"
            onClick={function () {
              handleOpenModal(groups[0]?.id || "todo");
            }}
          >
            + Add Task
          </button>
        </div>
      </header>

      <main className="app-main">
        <TaskListContainer
          groups={groups}
          tasks={tasks}
          changeStatus={handleChangeStatus}
          onStatusChange={handleChangeStatus}
          onOpenAddTask={handleOpenModal}
          onAddTask={handleOpenModal}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleOpenEditModal}
          onClose={handleCloseModal}
        />
      </main>

      {isModalOpen && (
        <TaskModalContainer
          key={editingTask ? editingTask.id : selectedGroupId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          closeModal={handleCloseModal}
          groups={groups}
          taskToEdit={editingTask}
          defaultGroupId={selectedGroupId}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
}
