import Header from "../components/Header";
import GroupList from "../components/groups/GroupList";
import Modal from "../components/Modal";
import TaskForm from "../components/groups/tasks/TaskForm";
import TodoDndContext from "../dnd/TodoDndContext";
import { useTodo } from "../hooks/useTodo";

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
      <Header
        newGroupTitle={newGroupTitle}
        onNewGroupTitleChange={setNewGroupTitle}
        onAddGroup={handleAddGroup}
        onDeleteGroupByName={handleDeleteGroupByName}
        onOpenAddTask={handleOpenAddModal}
      />

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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "EditingTask" : "AddTask"}
      >
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
