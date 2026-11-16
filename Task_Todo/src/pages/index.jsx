import { GroupList, Header, TaskModal } from "../components";
import { useTodo } from "../hooks/useTodo";

export default function TodoPage() {
  const {
    groups,
    newGroupTitle,
    setNewGroupTitle,
    isModalOpen,
    selectedGroupId,
    editingTask,
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
