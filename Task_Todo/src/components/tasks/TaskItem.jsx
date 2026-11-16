export default function TaskItem({
  task,
  currentGroupId,
  allGroups = [],
  onStatusChange,
  onDeleteTask,
  onEditTask,
}) {
  function handleEdit() {
    if (onEditTask) {
      onEditTask(task);
    }
  }

  function handleDelete() {
    if (onDeleteTask) {
      onDeleteTask(task.id);
    }
  }

  function handleStatusChange(event) {
    if (onStatusChange) {
      onStatusChange(task.id, event.target.value);
    }
  }

  return (
    <div className="border-0 rounded-lg px-1.25 py-2.5 flex flex-col gap-3.75 bg-[#e2ebf6] w-full min-w-0 max-w-full">
      <div className="flex flex-wrap justify-between items-start gap-2 min-w-0 w-full">
        <h4 className="m-0 min-w-0 flex-1 text-sm font-semibold text-[#0f172a] wrap:anywhere">
          {task.title}
        </h4>
        {onDeleteTask && (
          <div className="flex gap-1.5 shrink-0">
            <button
              type="button"
              className="bg-[#eff6ff] text-[#2563eb] hover:underline px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer"
              onClick={handleEdit}
            >
              Change
            </button>
            <button
              type="button"
              className="bg-[#eff6ff] text-[#ff0c30] hover:underline px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {task.description && (
        <p className="w-full min-w-0 max-w-full m-0 text-[13px] text-[#475569] whitespace-pre-wrap wrap:anywhere">
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center pt-1 text-xs">
        <span className="text-[#64748b]">Status:</span>
        <select
          className="bg-[#f1f5f9] border border-[#cbd5e1] rounded-md px-2 py-0.75 text-xs text-[#334155] cursor-pointer outline-none"
          value={task.status || currentGroupId}
          onChange={handleStatusChange}
        >
          {allGroups.map(function (item) {
            return (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
