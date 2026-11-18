import { useSortableGroup, DragHandle } from "../../dnd/TodoDndContext";
import GroupMenu from "./groupMenu";
import TaskList from "./task/taskList";

export default function GroupItem({
  group,
  tasks = [],
  allGroups = [],
  onStatusChange,
  onAddTask,
  onDeleteGroup,
  onDeleteTask,
  onEditTask,
  isOpen,
  onToggleMenu,
  onCloseMenu,
}) {
  const { setNodeRef, style, dragHandleProps } = useSortableGroup(group);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#f8fafc] w-full min-w-0 max-w-full border border-[#e2e8f0] rounded-xl p-4 flex flex-col"
    >
      <div className="flex justify-between items-center pb-3">
        <div className="flex items-center gap-2">
          <h3 className="m-0 text-base font-bold text-[#1e293b]">
            {group.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <DragHandle {...dragHandleProps} />
          <GroupMenu
            groupId={group.id}
            onAddTask={onAddTask}
            onDeleteGroup={onDeleteGroup}
            isOpen={isOpen}
            onToggle={onToggleMenu}
            onClose={onCloseMenu}
          />
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
