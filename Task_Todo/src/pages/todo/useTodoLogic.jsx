import { useState } from "react";
import defaultGroups from "../../constants/defaultGroups";
import { handleDndDragEnd } from "../../dnd/TodoDndContext";

const normalizeName = (name) => (name || "").trim().toLowerCase();

export const useTodo = () => {
  const [groups, setGroups] = useState(defaultGroups);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(1);
  const [editingTask, setEditingTask] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Logic kiểm tra trùng lặp tên nhóm: so sánh tên đã chuẩn hóa với các nhóm hiện có
  const isDuplicateGroup = (title) => {
    return groups.some((g) => normalizeName(g.title) === normalizeName(title));
  };

  // Logic kiểm tra trùng lặp tiêu đề công việc (Task):
  // - currentTaskId: dùng để loại trừ task đang chỉnh sửa (tránh việc task tự báo trùng tiêu đề với chính nó)
  // - Duyệt qua tất cả các nhóm (some cấp 1) và từng task trong mỗi nhóm (some cấp 2)
  const isDuplicateTask = (title, currentTaskId = null) => {
    return groups.some((g) =>
      (g.tasks || []).some(
        (t) =>
          String(t.id) !== String(currentTaskId) &&
          normalizeName(t.title) === normalizeName(title),
      ),
    );
  };

  // Logic bật/tắt menu 3 chấm của cột: nếu click vào cột đang mở thì đóng, ngược lại thì mở cột đó
  const handleToggleMenu = (groupId) => {
    setActiveMenuId((prev) => (prev === groupId ? null : groupId));
  };

  // Logic đóng menu 3 chấm
  const handleCloseMenu = () => {
    setActiveMenuId(null);
  };

  // Logic mở Modal thêm task mới cho một nhóm cụ thể:
  // Đóng menu, xóa dữ liệu task đang edit, đặt nhóm mặc định và bật cờ isModalOpen
  const handleOpenModal = (groupId) => {
    handleCloseMenu();
    setEditingTask(null);
    setSelectedGroupId(groupId || groups[0]?.id || 1);
    setIsModalOpen(true);
  };

  // Logic đóng Modal: tắt modal và đưa trạng thái editingTask về null
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Logic mở Modal chỉnh sửa task:
  // Đóng menu, nạp dữ liệu task cần sửa vào editingTask, đồng bộ selectedGroupId và mở modal
  const handleOpenEditModal = (task) => {
    handleCloseMenu();
    setEditingTask(task);
    setSelectedGroupId(task.groupId || task.status || 1);
    setIsModalOpen(true);
  };

  // Logic mở nhanh modal thêm task từ nút trên Header (mặc định chọn nhóm đầu tiên)
  const handleOpenAddModal = () => handleOpenModal(groups[0]?.id || 1);

  // Logic thêm task mới vào nhóm:
  // 1. Kiểm tra tiêu đề có bị trùng không
  // 2. Tạo đối tượng task mới (tự sinh ID bằng timestamp nếu chưa có)
  // 3. Cập nhật state groups: tìm nhóm tương ứng và chèn task vào mảng tasks
  const handleAddTask = (newTask) => {
    if (isDuplicateTask(newTask.title)) {
      alert("Task title has been used");
      return false;
    }

    const targetGroupId = newTask.status || newTask.groupId || groups[0]?.id;
    const taskToAdd = {
      ...newTask,
      id: newTask.id || Date.now().toString(),
      groupId: targetGroupId,
      status: targetGroupId,
    };
    console.log("Task title:", taskToAdd.title, taskToAdd);

    setGroups((prev) =>
      prev.map((g) =>
        String(g.id) === String(targetGroupId)
          ? { ...g, tasks: [...(g.tasks || []), taskToAdd] }
          : g,
      ),
    );
    return true;
  };

  // Logic cập nhật thông tin task đã có:
  // 1. Kiểm tra trùng lặp tiêu đề với các task khác (bỏ qua chính task này qua updatedTask.id)
  // 2. Chuẩn hóa tiêu đề và gán lại groupId/status mới
  // 3. Cập nhật state groups: loại bỏ task cũ khỏi nhóm trước đó và chèn task mới vào nhóm đích
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
        // Lọc bỏ task cũ ra khỏi nhóm hiện tại
        const withoutTask = (g.tasks || []).filter(
          (t) => String(t.id) !== String(taskToUpdate.id),
        );
        // Nếu đây là nhóm đích mới thì thêm task đã cập nhật vào danh sách
        return String(g.id) === String(newGroupId)
          ? { ...g, tasks: [...withoutTask, taskToUpdate] }
          : { ...g, tasks: withoutTask };
      }),
    );
    return true;
  };

  // Logic chuyển trạng thái (nhóm) của task trực tiếp từ thẻ select:
  // 1. Tìm và lấy task cần chuyển ra khỏi nhóm cũ, cập nhật lại groupId và status mới
  // 2. Chèn task đó vào nhóm mới
  const handleChangeStatus = (taskId, newStatus) => {
    setGroups((prev) => {
      let movingTask = null;

      // Bước 1: Duyệt tìm và lấy task ra khỏi nhóm cũ
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

      // Nếu không tìm thấy task thì không thay đổi gì
      if (!movingTask) return prev;

      // Bước 2: Thêm task vào nhóm có id khớp với newStatus
      return withoutMoving.map((g) =>
        String(g.id) === String(newStatus)
          ? { ...g, tasks: [...g.tasks, movingTask] }
          : g,
      );
    });
  };

  // Logic xóa task: duyệt qua tất cả các nhóm và lọc bỏ task có id trùng khớp
  const handleDeleteTask = (taskId) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        tasks: (g.tasks || []).filter((t) => String(t.id) !== String(taskId)),
      })),
    );
  };

  // Logic xóa một nhóm theo groupId: đóng menu và loại bỏ nhóm khỏi mảng groups
  const handleDeleteGroup = (groupId) => {
    handleCloseMenu();
    setGroups((prev) => prev.filter((g) => String(g.id) !== String(groupId)));
  };

  // Logic xóa nhóm theo tên nhập từ Header:
  // - Nếu ô nhập trống: mặc định xóa nhóm cuối cùng trong danh sách
  // - Nếu có nhập tên: tìm nhóm khớp tên để xóa và reset lại ô nhập
  const handleDeleteGroupByName = () => {
    const trimmed = newGroupTitle.trim().toLowerCase();
    if (!trimmed) {
      if (groups.length > 0) handleDeleteGroup(groups[groups.length - 1].id);
      return;
    }
    const groupToDelete = groups.find((g) => g.title.toLowerCase() === trimmed);
    if (!groupToDelete) return;

    handleDeleteGroup(groupToDelete.id);
    setNewGroupTitle("");
  };

  // Logic thêm nhóm mới từ ô nhập trên Header:
  // 1. Ngăn chặn hành vi submit mặc định của form
  // 2. Kiểm tra tên nhóm không được để trống và không được trùng với tên nhóm đã có
  // 3. Tạo nhóm mới với id là timestamp, tự động tạo type (slug) và danh sách task rỗng
  // 4. Thêm nhóm vào danh sách groups và xóa nội dung ô nhập
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
