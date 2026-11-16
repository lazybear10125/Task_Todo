import TaskForm from "./TaskForm";

export default function TaskModal({
  isOpen,
  onClose,
  closeModal,
  groups = [],
  defaultGroupId,
  taskToEdit = null,
  onAddTask,
  onUpdateTask,
}) {
  const handleCloseCallback = onClose || closeModal;

  if (!isOpen) {
    return null;
  }

  const isEditMode = Boolean(taskToEdit);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50"
      onClick={handleCloseCallback}
    >
      <div
        className="bg-white rounded-xl w-full max-w-110 p-6 shadow-[0_10px_25px_rgba(0,0,0,0.15)] flex flex-col gap-4"
        onClick={function (e) {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-between items-center border-b border-[#f1f5f9] pb-3">
          <h2 className="m-0 text-[18px] font-bold text-[#0f172a]">
            {isEditMode ? "EditingTask" : "AddTask"}
          </h2>
          <button
            type="button"
            className="bg-transparent border-0 text-[18px] text-[#94a3b8] hover:text-[#475569] cursor-pointer p-0 leading-none"
            onClick={handleCloseCallback}
          >
            ✕
          </button>
        </div>

        <TaskForm
          groups={groups}
          defaultGroupId={defaultGroupId}
          taskToEdit={taskToEdit}
          isEditMode={isEditMode}
          onClose={handleCloseCallback}
          onAddTask={onAddTask}
          onUpdateTask={onUpdateTask}
        />
      </div>
    </div>
  );
}
