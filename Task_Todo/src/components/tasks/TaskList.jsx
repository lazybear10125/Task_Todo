import TaskItem from "./TaskItem";

export default function TaskList({
  tasks = [],
  currentGroupId,
  allGroups = [],
  onStatusChange,
  onDeleteTask,
  onEditTask,
}) {
  const isEmpty = !tasks || tasks.length === 0;

  return (
    <div className="flex flex-col gap-4 mt-3.5 min-h-[80px] w-full min-w-0">
      {isEmpty ? (
        <div className="text-center text-[#94a3b8] text-[13px] py-6 px-2 border border-dashed border-[#cbd5e1] rounded-lg">
          No Problem
        </div>
      ) : (
        tasks.map(function (task) {
          return (
            <TaskItem
              key={task.id}
              task={task}
              currentGroupId={currentGroupId}
              allGroups={allGroups}
              onStatusChange={onStatusChange}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
            />
          );
        })
      )}
    </div>
  );
}
