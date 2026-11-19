/* eslint-disable react-refresh/only-export-components */
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Hàm tiện ích: Di chuyển một phần tử từ vị trí fromIndex sang toIndex trong mảng và trả về mảng mới (bất biến - immutable)
export const arrayMove = (array, fromIndex, toIndex) => {
  const newArray = [...array];
  const [movedItem] = newArray.splice(fromIndex, 1); // Cắt lấy phần tử cần chuyển ra khỏi mảng
  newArray.splice(toIndex, 0, movedItem); // Chèn phần tử đó vào vị trí đích mới
  return newArray;
};

// Hook tùy chỉnh: Cấu hình tính năng kéo thả (sortable) cho từng cột nhóm (Group)
export const useSortableGroup = (group) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: `group-${group.id}`, // Tiền tố "group-" giúp phân biệt ID nhóm với ID công việc tránh xung đột
      data: {
        type: "group",
        group,
      },
      animateLayoutChanges: () => false, // Vô hiệu hóa animation mặc định để tránh giật lag khi re-render
    });

  // Chuyển đổi toạ độ kéo thả của dnd-kit thành chuỗi CSS Transform hợp lệ
  const style = {
    transform: CSS.Translate.toString(transform),
    transition: "none",
  };

  // Gom các thuộc tính accessibility và sự kiện kéo thả (listeners) để gắn vào nút kéo (handle)
  const dragHandleProps = {
    ...attributes,
    ...listeners,
  };

  return {
    setNodeRef,
    style,
    isDragging,
    dragHandleProps,
  };
};

// Hook tùy chỉnh: Cấu hình tính năng kéo thả (sortable) cho từng thẻ công việc (Task)
export const useSortableTask = (task) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: task.id,
      data: {
        type: "task",
        task,
      },
      animateLayoutChanges: () => false,
    });

  // Tạo kiểu CSS hiển thị khi kéo: giảm độ mờ (opacity: 0.4) để người dùng nhận biết item đang được kéo
  const style = {
    transform: CSS.Translate.toString(transform),
    transition: "none",
    opacity: isDragging ? 0.4 : 1,
  };

  const dragProps = {
    ...attributes,
    ...listeners,
  };

  return {
    setNodeRef,
    style,
    isDragging,
    dragProps,
  };
};

// Component nút kéo (drag handle) chuyên dụng để kéo di chuyển cột
export function DragHandle({ className = "", ...props }) {
  return (
    <button
      type="button"
      title="Drag column"
      className={`p-1 text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0] rounded cursor-grab active:cursor-grabbing flex items-center justify-center border-0 bg-transparent touch-none select-none ${className}`}
      {...props}
    >
      {/* <img
        src="https://www.svgrepo.com/show/459043/drag-handle.svg"
        alt="Drag"
        className="w-4 h-4 pointer-events-none"
      /> */}
    </button>
  );
}

// Hàm xử lý logic chính khi kết thúc thao tác kéo thả (onDragEnd)
export const handleDndDragEnd = (event, setGroups) => {
  const { active, over } = event;

  // Nếu không thả vào vùng nào hợp lệ hoặc thả vào chính vị trí ban đầu thì không làm gì
  if (!over || String(active.id) === String(over.id)) return;

  // Kiểm tra xem đối tượng đang được kéo là Cột (Group) hay Công việc (Task)
  const isDraggingGroup =
    active.data.current?.type === "group" ||
    String(active.id).startsWith("group-");

  // --- TRƯỜNG HỢP 1: KÉO THẢ ĐỔI THỨ TỰ CỘT (GROUP) ---
  if (isDraggingGroup) {
    setGroups((prevGroups) => {
      // Lấy id gốc của group đang kéo (bỏ tiền tố 'group-')
      const activeGroupId = String(active.id).replace("group-", "");
      let overGroupId = String(over.id).replace("group-", "");

      // Nếu điểm thả rơi trúng một task bên trong cột khác, lấy groupId của task đó làm cột đích
      const overTask = prevGroups
        .flatMap((g) => g.tasks || [])
        .find((t) => String(t.id) === String(over.id));
      if (overTask) {
        overGroupId = String(overTask.groupId);
      }

      // Nếu kéo thả cùng một cột thì giữ nguyên state
      if (activeGroupId === overGroupId) return prevGroups;

      // Tìm vị trí chỉ mục (index) hiện tại và mới của cột
      const oldIndex = prevGroups.findIndex(
        (g) => String(g.id) === activeGroupId,
      );
      const newIndex = prevGroups.findIndex(
        (g) => String(g.id) === overGroupId,
      );

      // Nếu không tìm thấy cột thì giữ nguyên state
      if (oldIndex === -1 || newIndex === -1) return prevGroups;
      // Dùng arrayMove để đổi chỗ 2 cột trong mảng
      return arrayMove(prevGroups, oldIndex, newIndex);
    });
    return;
  }

  // --- TRƯỜNG HỢP 2: KÉO THẢ CÔNG VIỆC (TASK) ---
  setGroups((prevGroups) => {
    // Tạo bản sao shallow copy cho mảng groups và mảng tasks của từng group
    const newGroups = prevGroups.map((group) => ({
      ...group,
      tasks: [...(group.tasks || [])],
    }));

    // Tìm nhóm nguồn (cột chứa task đang được kéo)
    const sourceGroup = newGroups.find((group) =>
      group.tasks.some((task) => String(task.id) === String(active.id)),
    );

    // Tìm nhóm đích (cột mà con trỏ đang trỏ tới hoặc chứa task được trỏ tới)
    const targetGroup = newGroups.find(
      (group) =>
        String(group.id) === String(over.id) ||
        `group-${group.id}` === String(over.id) ||
        group.tasks.some((task) => String(task.id) === String(over.id)),
    );

    // Nếu không xác định được nhóm nguồn hoặc nhóm đích thì không thay đổi
    if (!sourceGroup || !targetGroup) return prevGroups;

    // Tìm vị trí của task trong nhóm nguồn
    const oldIndex = sourceGroup.tasks.findIndex(
      (task) => String(task.id) === String(active.id),
    );
    if (oldIndex === -1) return prevGroups;

    // 2.1: Kéo thả sắp xếp lại thứ tự công việc TRONG CÙNG MỘT NHÓM
    if (String(sourceGroup.id) === String(targetGroup.id)) {
      const newIndex = sourceGroup.tasks.findIndex(
        (task) => String(task.id) === String(over.id),
      );

      // Nếu tìm thấy vị trí mới và khác vị trí cũ thì sắp xếp lại
      if (newIndex !== -1 && oldIndex !== newIndex) {
        sourceGroup.tasks = arrayMove(sourceGroup.tasks, oldIndex, newIndex);
      }
      return newGroups;
    }

    // 2.2: Kéo thả công việc SANG NHÓM KHÁC
    // Lấy task ra khỏi nhóm nguồn
    const [movedTask] = sourceGroup.tasks.splice(oldIndex, 1);

    // Cập nhật lại groupId và status của task theo nhóm đích mới
    const updatedTask = {
      ...movedTask,
      groupId: targetGroup.id,
      status: targetGroup.id,
    };

    // Tìm vị trí task đích trong nhóm mới (nếu thả đè lên trên một task khác)
    const overTaskIndex = targetGroup.tasks.findIndex(
      (task) => String(task.id) === String(over.id),
    );

    // Nếu thả vào vị trí một task cụ thể thì chèn vào vị trí đó, ngược lại thêm vào cuối danh sách
    if (overTaskIndex >= 0) {
      targetGroup.tasks.splice(overTaskIndex, 0, updatedTask);
    } else {
      targetGroup.tasks.push(updatedTask);
    }

    return newGroups;
  });
};

// Component bọc Context cho tính năng kéo thả của toàn bộ ứng dụng Todo
export default function TodoDndContext({ children, onDragEnd }) {
  // Cấu hình PointerSensor: đặt ngưỡng di chuyển tối thiểu 5px trước khi kích hoạt drag,
  // giúp tránh việc người dùng chỉ click chuột (hoặc bấm nút sửa/xóa) mà bị hiểu nhầm thành kéo thả
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  // Chiến lược phát hiện va chạm:
  // Ưu tiên va chạm ngay dưới con trỏ (pointerWithin), nếu không có mới tìm các góc gần nhất (closestCorners)
  const collisionDetectionStrategy = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    return closestCorners(args);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={(event) => {
        // Ghi log khi bắt đầu kéo phần tử
        console.log("Drag Start:", event.active.id);
      }}
      onDragEnd={(event) => {
        // Ghi log và chuyển tiếp sự kiện kéo thả cho handler xử lý cập nhật state
        console.log("Drag End:", event.active.id, event.over?.id);
        onDragEnd(event);
      }}
      onDragCancel={() => {
        // Ghi log khi thao tác kéo bị hủy bỏ (ví dụ: nhấn ESC)
        console.log("Drag Cancel");
      }}
    >
      {children}
    </DndContext>
  );
}
