import { useState } from "react";
import Header from "../components/header/Header";
import GroupList from "../components/groups/GroupList";
import TaskModal from "../components/modal/TaskModal";
import { DEFAULT_DATA } from "../constants/taskConstants";

function normalizeName(name) {
  return (name || "").trim().toLowerCase();
}

export default function TodoPage() {
  const [groups, setGroups] = useState(DEFAULT_DATA);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(1);
  const [editingTask, setEditingTask] = useState(null);

  function isDuplicateGroup(title) {
    const normalized = normalizeName(title);
    return groups.some(function (group) {
      return normalizeName(group.title) === normalized;
    });
  }

  function isDuplicateTask(title, currentTaskId = null) {
    const normalized = normalizeName(title);

    return groups.some(function (group) {
      return (group.tasks || []).some(function (task) {
        return (
          String(task.id) !== String(currentTaskId) &&
          normalizeName(task.title) === normalized
        );
      });
    });
  }

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
    if (isDuplicateTask(newTask.title)) {
      alert("Task title has been used");
      return false;
    }

    const targetGroupId =
      newTask.status || newTask.groupId || groups[0]?.id || 1;
    const taskToAdd = {
      ...newTask,
      id: newTask.id || Date.now().toString(),
      groupId: targetGroupId,
      status: targetGroupId,
    };

    setGroups(function (prev) {
      return prev.map(function (group) {
        if (String(group.id) === String(targetGroupId)) {
          return {
            ...group,
            tasks: [...(group.tasks || []), taskToAdd],
          };
        }
        return group;
      });
    });
    return true;
  }

  function handleUpdateTask(updatedTask) {
    if (isDuplicateTask(updatedTask.title, updatedTask.id)) {
      alert("Task title has been used");
      return false;
    }

    const newGroupId = updatedTask.status || updatedTask.groupId;
    const taskToUpdate = {
      ...updatedTask,
      title: updatedTask.title.trim(),
      groupId: newGroupId,
      status: newGroupId,
    };

    setGroups(function (prev) {
      return prev.map(function (group) {
        const filteredTasks = (group.tasks || []).filter(function (item) {
          return String(item.id) !== String(taskToUpdate.id);
        });

        if (String(group.id) === String(newGroupId)) {
          return {
            ...group,
            tasks: [...filteredTasks, taskToUpdate],
          };
        }

        return {
          ...group,
          tasks: filteredTasks,
        };
      });
    });
    return true;
  }

  function handleChangeStatus(taskId, newStatus) {
    setGroups(function (prev) {
      let movingTask = null;

      for (const group of prev) {
        const found = (group.tasks || []).find(function (t) {
          return String(t.id) === String(taskId);
        });
        if (found) {
          movingTask = {
            ...found,
            groupId: newStatus,
            status: newStatus,
          };
          break;
        }
      }

      if (!movingTask) return prev;

      return prev.map(function (group) {
        const remainingTasks = (group.tasks || []).filter(function (t) {
          return String(t.id) !== String(taskId);
        });

        if (String(group.id) === String(newStatus)) {
          return {
            ...group,
            tasks: [...remainingTasks, movingTask],
          };
        }

        return {
          ...group,
          tasks: remainingTasks,
        };
      });
    });
  }

  function handleDeleteTask(taskId) {
    setGroups(function (prev) {
      return prev.map(function (group) {
        return {
          ...group,
          tasks: (group.tasks || []).filter(function (task) {
            return String(task.id) !== String(taskId);
          }),
        };
      });
    });
  }

  function handleDeleteGroup(groupId) {
    setGroups(function (prev) {
      return prev.filter(function (group) {
        return String(group.id) !== String(groupId);
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
    if (!trimmed) {
      alert("Please enter GroupName");
      return;
    }

    if (isDuplicateGroup(trimmed)) {
      alert("GroupName has been used");
      return;
    }

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

  function handleOpenAddModal() {
    handleOpenModal(groups[0]?.id || 1);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9]">
      <Header
        newGroupTitle={newGroupTitle}
        onNewGroupTitleChange={setNewGroupTitle}
        onAddGroup={handleAddGroup}
        onDeleteGroupByName={handleDeleteGroupByName}
        onOpenAddTask={handleOpenAddModal}
      />

      <main className="flex-1 flex overflow-y-auto overflow-x-hidden">
        <GroupList
          groups={groups}
          onStatusChange={handleChangeStatus}
          onAddTask={handleOpenModal}
          onDeleteGroup={handleDeleteGroup}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleOpenEditModal}
        />
      </main>

      {isModalOpen && (
        <TaskModal
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
