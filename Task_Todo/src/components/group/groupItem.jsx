import GroupMenu from "./groupMenu";
import TaskList from "./task/taskList";

// Component đại diện cho một cột Kanban (Group Item)
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
  return (
    <div className="bg-[#f8fafc] w-full min-w-0 max-w-full border border-[#e2e8f0] rounded-xl p-4 flex flex-col">
      {/* Tiêu đề cột và menu 3 chấm */}
      <div className="flex justify-between items-center pb-3">
        <div className="flex items-center gap-2">
          <h3 className="m-0 text-base font-bold text-[#1e293b]">
            {group.title}
          </h3>
        </div>

        {/* Menu thao tác thêm task vào cột hoặc xóa cột */}
        <GroupMenu
          groupId={group.id}
          onAddTask={onAddTask}
          onDeleteGroup={onDeleteGroup}
        />
      </div>

      {/* Danh sách các công việc thuộc cột này */}
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
