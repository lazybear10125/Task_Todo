import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskItem from "./taskItem";

// Component hiển thị danh sách các thẻ công việc trong một cột (Group)
export default function TaskList({
  tasks = [],
  currentGroupId,
  allGroups = [],
  onStatusChange,
  onDeleteTask,
  onEditTask,
}) {
  // Kiểm tra danh sách task có rỗng hay không
  const isEmpty = !tasks || tasks.length === 0;
  // Lấy danh sách ID của các task để cung cấp cho SortableContext nhận diện thứ tự
  const taskIds = tasks.map((task) => task.id);

  return (
    // Bọc trong SortableContext với chiến lược sắp xếp dọc (verticalListSortingStrategy)
    <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
      <div className="flex flex-col gap-4 mt-3.5 min-h-20 w-full min-w-0 flex-1">
        {isEmpty ? (
          // Hiển thị khung thông báo khi cột chưa có công việc nào
          <div className="text-center text-[#94a3b8] text-[13px] py-6 px-2 border border-dashed border-[#cbd5e1] rounded-lg">
            No Problem
          </div>
        ) : (
          // Render danh sách các thẻ TaskItem
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
    </SortableContext>
  );
}
