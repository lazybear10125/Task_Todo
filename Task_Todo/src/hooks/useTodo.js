import { useState } from "react";
import defaultGroups from "../constants/defaultGroups";
import { handleDndDragEnd } from "../dnd/TodoDndContext";

const normalizeName = (name) => (name || "").trim().toLowerCase();

export const useTodo = () => {
  const [groups, setGroups] = useState(defaultGroups);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(1);
  const [editingTask, setEditingTask] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const isDuplicateGroup = (title) =>
    groups.some((g) => normalizeName(g.title) === normalizeName(title));

  const isDuplicateTask = (title, currentTaskId = null) =>
    groups.some((g) =>
      (g.tasks || []).some(
        (t) =>
          String(t.id) !== String(currentTaskId) &&
          normalizeName(t.title) === normalizeName(title),
      ),
    );

  const handleToggleMenu = (groupId) => {
    setActiveMenuId((prev) => (prev === groupId ? null : groupId));
  };

  const handleCloseMenu = () => {
    setActiveMenuId(null);
  };

  const handleOpenModal = (groupId) => {
    handleCloseMenu();
    setEditingTask(null);
    setSelectedGroupId(groupId || groups[0]?.id || 1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleOpenEditModal = (task) => {
    handleCloseMenu();
    setEditingTask(task);
    setSelectedGroupId(task.groupId || task.status || 1);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => handleOpenModal(groups[0]?.id || 1);

  const handleAddTask = (newTask) => {
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

    setGroups((prev) =>
      prev.map((g) =>
        String(g.id) === String(targetGroupId)
          ? { ...g, tasks: [...(g.tasks || []), taskToAdd] }
          : g,
      ),
    );
    return true;
  };

  const handleUpdateTask = (updatedTask) => {
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

    setGroups((prev) =>
      prev.map((g) => {
        const withoutTask = (g.tasks || []).filter(
          (t) => String(t.id) !== String(taskToUpdate.id),
        );
        return String(g.id) === String(newGroupId)
          ? { ...g, tasks: [...withoutTask, taskToUpdate] }
          : { ...g, tasks: withoutTask };
      }),
    );
    return true;
  };

  const handleChangeStatus = (taskId, newStatus) => {
    setGroups((prev) => {
      let movingTask = null;

      const withoutMoving = prev.map((g) => ({
        ...g,
        tasks: (g.tasks || []).filter((t) => {
          if (String(t.id) === String(taskId)) {
            movingTask = { ...t, groupId: newStatus, status: newStatus };
            return false;
          }
          return true;
        }),
      }));

      if (!movingTask) return prev;

      return withoutMoving.map((g) =>
        String(g.id) === String(newStatus)
          ? { ...g, tasks: [...g.tasks, movingTask] }
          : g,
      );
    });
  };

  const handleDeleteTask = (taskId) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        tasks: (g.tasks || []).filter((t) => String(t.id) !== String(taskId)),
      })),
    );
  };

  const handleDeleteGroup = (groupId) => {
    handleCloseMenu();
    setGroups((prev) => prev.filter((g) => String(g.id) !== String(groupId)));
  };

  const handleDeleteGroupByName = () => {
    const trimmed = newGroupTitle.trim().toLowerCase();
    if (!trimmed) {
      if (groups.length > 0) handleDeleteGroup(groups[groups.length - 1].id);
      return;
    }
    const groupToDelete = groups.find((g) => g.title.toLowerCase() === trimmed);
    if (groupToDelete) {
      handleDeleteGroup(groupToDelete.id);
      setNewGroupTitle("");
    }
  };

  const handleAddGroup = (event) => {
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

    const newGroup = {
      id: Date.now(),
      type: trimmed.toLowerCase().replace(/\s+/g, "-"),
      title: trimmed,
      tasks: [],
    };

    setGroups((prev) => [...prev, newGroup]);
    setNewGroupTitle("");
  };

  const handleDragEnd = (event) => handleDndDragEnd(event, setGroups);

  return {
    groups,
    newGroupTitle,
    setNewGroupTitle,
    isModalOpen,
    selectedGroupId,
    editingTask,
    activeMenuId,
    handleToggleMenu,
    handleCloseMenu,
    handleAddGroup,
    handleDeleteGroup,
    handleDeleteGroupByName,
    handleOpenAddModal,
    handleOpenModal,
    handleCloseModal,
    handleOpenEditModal,
    handleAddTask,
    handleUpdateTask,
    handleChangeStatus,
    handleDeleteTask,
    handleDragEnd,
  };
};

export default useTodo;
