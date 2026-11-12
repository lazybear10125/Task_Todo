import TaskList from "../components/TaskList";

export default function TaskListContainer({
  groups = [],
  tasks = [],
  changeStatus,
  onStatusChange,
  onOpenAddTask,
  onAddTask,
  onDeleteGroup,
  deleteGroup,
  onDeleteTask,
  onEditTask,
}) {
  const handleStatusChange = onStatusChange || changeStatus;
  const handleAddTask = onOpenAddTask || onAddTask;
  const handleDeleteGroup = onDeleteGroup || deleteGroup;

  const columns = groups.map(function (group) {
    const tasksInGroup = tasks.filter(function (task) {
      if (task.groupId !== undefined && task.groupId !== null) {
        return String(task.groupId) === String(group.id);
      }
      return String(task.status) === String(group.id);
    });

    return {
      id: group.id,
      title: group.title,
      tasks: tasksInGroup,
    };
  });

  return (
    <TaskList
      columns={columns}
      groups={groups}
      tasks={tasks}
      onStatusChange={handleStatusChange}
      changeStatus={handleStatusChange}
      onAddTask={handleAddTask}
      onDeleteGroup={handleDeleteGroup}
      onDeleteTask={onDeleteTask}
      onEditTask={onEditTask}
    />
  );
}
