import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import GroupItem from "./groupItem";

export default function GroupList({
  groups = [],
  onStatusChange,
  onAddTask,
  onDeleteGroup,
  onDeleteTask,
  onEditTask,
  activeMenuId,
  onToggleMenu,
  onCloseMenu,
}) {
  const groupIds = groups.map((g) => `group-${g.id}`);

  return (
    <SortableContext items={groupIds} strategy={rectSortingStrategy}>
      <div className="container mx-auto flex-1 w-full min-w-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 p-3 sm:p-4 lg:p-6 items-start overflow-x-hidden">
        {groups.map(function (group) {
          return (
            <GroupItem
              key={group.id}
              group={group}
              tasks={group.tasks || []}
              allGroups={groups}
              onStatusChange={onStatusChange}
              onAddTask={onAddTask}
              onDeleteGroup={onDeleteGroup}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              isOpen={activeMenuId === group.id}
              onToggleMenu={() => onToggleMenu?.(group.id)}
              onCloseMenu={onCloseMenu}
            />
          );
        })}
      </div>
    </SortableContext>
  );
}
