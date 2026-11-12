import { useState } from "react";
import TaskListContainer from "../containers/TaskListContainer";
import TaskModalContainer from "../containers/TaskModalContainer";
import { DEFAULT_DATA } from "../constants/taskConstants";

const INITIAL_TASKS = DEFAULT_DATA.flatMap(function (group) {
  return group.tasks;
});

export default function TodoPage() {
  const [groups, setGroups] = useState(DEFAULT_DATA);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(1);
  const [editingTask, setEditingTask] = useState(null);

  function handleOpenModal(groupId) {
    setEditingTask(null);
    setSelectedGroupId(groupId || groups[0]?.id || 1);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingTask(null);
  }

  function handleOpenEditModal(task) {
    setEditingTask(task);
    setSelectedGroupId(task.groupId || task.status || 1);
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

  function handleDeleteGroup(groupId) {
    setGroups(function (prev) {
      return prev.filter(function (group) {
        return String(group.id) !== String(groupId);
      });
    });

    setTasks(function (prev) {
      return prev.filter(function (task) {
        return (
          String(task.groupId) !== String(groupId) &&
          String(task.status) !== String(groupId)
        );
      });
    });
  }

  function handleDeleteGroupByName() {
    const trimmed = newGroupTitle.trim().toLowerCase();
    if (!trimmed) {
      if (groups.length > 0) {
        handleDeleteGroup(groups[groups.length - 1].id);
      }
      return;
    }
    const groupToDelete = groups.find(function (g) {
      return g.title.toLowerCase() === trimmed;
    });
    if (groupToDelete) {
      handleDeleteGroup(groupToDelete.id);
      setNewGroupTitle("");
    }
  }

  function handleAddGroup(event) {
    event.preventDefault();
    const trimmed = newGroupTitle.trim();
    if (!trimmed) return;

    const id = Date.now();
    const newGroup = {
      id: id,
      type: trimmed.toLowerCase().replace(/\s+/g, "-"),
      title: trimmed,
      tasks: [],
    };

    setGroups(function (prev) {
      return [...prev, newGroup];
    });
    setNewGroupTitle("");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9]">
      <header className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h1 className="m-0 text-[20px] font-bold text-[#0f172a]">
            Todo Task
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <form className="flex items-center gap-2" onSubmit={handleAddGroup}>
            <input
              type="text"
              placeholder="Enter NameGroup News..."
              className="border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm outline-none w-[180px] focus:border-[#2563eb]"
              value={newGroupTitle}
              onChange={function (e) {
                setNewGroupTitle(e.target.value);
              }}
            />
            <button
              type="submit"
              className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] border border-[#cbd5e1] px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer"
            >
              + Add Group
            </button>
            <button
              type="button"
              className="bg-[#fef2f2] hover:bg-[#fee2e2] text-[#dc2626] border border-[#fecaca] px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer"
              onClick={handleDeleteGroupByName}
            >
              - Delete Group
            </button>
          </form>

          <button
            type="button"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-0 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
            onClick={function () {
              handleOpenModal(groups[0]?.id || 1);
            }}
          >
            + Add Task
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <TaskListContainer
          groups={groups}
          tasks={tasks}
          changeStatus={handleChangeStatus}
          onStatusChange={handleChangeStatus}
          onOpenAddTask={handleOpenModal}
          onAddTask={handleOpenModal}
          onDeleteGroup={handleDeleteGroup}
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
