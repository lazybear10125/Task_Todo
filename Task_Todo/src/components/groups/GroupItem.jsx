import TaskList from "../tasks/TaskList";

export default function GroupItem({
  group,
  tasks = [],
  allGroups = [],
  onStatusChange,
  onAddTask,
  onDeleteGroup,
  onDeleteTask,
  onEditTask,
}) {
  function handleAddTask() {
    if (onAddTask) {
      onAddTask(group.id);
    }
  }

  function handleDeleteGroup() {
    if (onDeleteGroup) {
      onDeleteGroup(group.id);
    }
  }

  return (
    <div className="bg-[#f8fafc] w-full min-w-0 max-w-full border border-[#e2e8f0] rounded-xl p-4 flex flex-col">
      <div className="flex justify-between items-center pb-3">
        <div className="flex items-center gap-2">
          <h3 className="m-0 text-base font-bold text-[#1e293b]">
            {group.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="bg-[#eff6ff] hover:bg-[#dbeafe] text-black border-0 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer"
            onClick={handleAddTask}
          >
            + Add
          </button>

          {onDeleteGroup && (
            <button
              type="button"
              className="bg-[#eff6ff] hover:bg-[#fee2e2] text-[#ff0c30] border-0 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer"
              onClick={handleDeleteGroup}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <TaskList
        tasks={tasks}
        currentGroupId={group.id}
        allGroups={allGroups}
        onStatusChange={onStatusChange}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
      />
    </div>
  );
}
