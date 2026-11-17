import { useSortableTask } from "../../../dnd/TodoDndContext";
import Button from "../../buttons/Button";

export default function TaskItem({
  task,
  currentGroupId,
  allGroups = [],
  onStatusChange,
  onDeleteTask,
  onEditTask,
}) {
  const { setNodeRef, style, dragProps } = useSortableTask(task);

  function handleEdit(e) {
    e.stopPropagation();
    if (onEditTask) {
      onEditTask(task);
    }
  }

  function handleDelete(e) {
    e.stopPropagation();
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
    <div
      ref={setNodeRef}
      style={style}
      {...dragProps}
      className="border-0 rounded-lg px-2.5 py-3 flex flex-col gap-3 bg-[#e2ebf6] w-full min-w-0 max-w-full cursor-grab active:cursor-grabbing select-none touch-none"
    >
      <div className="flex flex-wrap justify-between items-start gap-2 min-w-0 w-full">
        <h4 className="m-0 min-w-0 flex-1 text-sm font-semibold text-[#0f172a] wrap:anywhere">
          {task.title}
        </h4>
        {onDeleteTask && (
          <div
            className="flex gap-1.5 shrink-0"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Button
              variant="edit"
              className="text-xs px-2.5 py-1 rounded-md hover:underline"
              onClick={handleEdit}
            >
              Change
            </Button>
            <Button
              variant="delete"
              className="text-xs px-2.5 py-1 rounded-md bg-[#eff6ff] hover:bg-[#fee2e2] text-[#ff0c30] border-0 hover:underline"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {task.description && (
        <p className="w-full min-w-0 max-w-full m-0 text-[13px] text-[#475569] whitespace-pre-wrap wrap:anywhere">
          {task.description}
        </p>
      )}

      <div
        className="flex justify-between items-center pt-1 text-xs"
        onPointerDown={(e) => e.stopPropagation()}
      >
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
