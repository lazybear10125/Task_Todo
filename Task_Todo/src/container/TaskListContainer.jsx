import TaskList from "../components/TaskList";

export default function TaskListContainer({
  groups = [],
  tasks = [],
  changeStatus,
  onStatusChange,
  onOpenAddTask,
  onAddTask,
  onDeleteTask,
}) {
  const handleStatusChange = onStatusChange || changeStatus;
  const handleAddTask = onOpenAddTask || onAddTask;
  const columns = groups.map(function (group) {
    const tasksInGroup = tasks.filter(function (task) {
      if (task.groupId) {
        return task.groupId === group.id;
      }
      return task.status === group.id;
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
      onDeleteTask={onDeleteTask}
    />
  );
}
