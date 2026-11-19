import Header from "../../components/header";
import GroupList from "../../components/group/groupList";
import Modal from "../../components/modal";
import TaskForm from "../../components/group/task/taskForm";
import TodoDndContext from "../../dnd/TodoDndContext";
import { useTodo } from "./useTodoLogic";

export default function TodoPage() {
  const {
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
  } = useTodo();

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9]">
      {/* Header điều hướng trên cùng: ô nhập tạo/xóa nhóm và nút thêm công việc */}
      <Header
        newGroupTitle={newGroupTitle}
        onNewGroupTitleChange={setNewGroupTitle}
        onAddGroup={handleAddGroup}
        onDeleteGroupByName={handleDeleteGroupByName}
        onOpenAddTask={handleOpenAddModal}
      />

      {/* Khu vực nội dung chính: Bọc trong TodoDndContext để hỗ trợ kéo thả các cột và thẻ task */}
      <main className="flex-1 flex overflow-y-auto overflow-x-hidden">
        <TodoDndContext onDragEnd={handleDragEnd}>
          <GroupList
            groups={groups}
            onStatusChange={handleChangeStatus}
            onAddTask={handleOpenModal}
            onDeleteGroup={handleDeleteGroup}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleOpenEditModal}
            activeMenuId={activeMenuId}
            onToggleMenu={handleToggleMenu}
            onCloseMenu={handleCloseMenu}
          />
        </TodoDndContext>
      </main>

      {/* Modal popup phục vụ cả 2 nghiệp vụ: Thêm mới task hoặc Chỉnh sửa task hiện có */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "EditingTask" : "AddTask"}
      >
        {/* Thuộc tính key giúp React re-mount form và reset lại formState mỗi khi đổi task hoặc đổi nhóm */}
        <TaskForm
          key={editingTask ? editingTask.id : selectedGroupId}
          groups={groups}
          defaultGroupId={selectedGroupId}
          taskToEdit={editingTask}
          isEditMode={Boolean(editingTask)}
          onClose={handleCloseModal}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
        />
      </Modal>
    </div>
  );
}
