import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "../../../schema/taskSchema";
import Button from "../../button/button";

// Form thêm mới hoặc chỉnh sửa công việc (Task)
export default function TaskForm({
  groups = [],
  defaultGroupId,
  taskToEdit = null,
  isEditMode = false,
  onClose,
  onAddTask,
  onUpdateTask,
}) {
  // Khởi tạo React Hook Form kết hợp với Zod schema để tự động xác thực dữ liệu
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: 1,
    },
  });

  // Đồng bộ dữ liệu vào Form khi component mount hoặc khi taskToEdit/defaultGroupId thay đổi:
  // Nếu đang chỉnh sửa: nạp dữ liệu cũ của taskToEdit
  // Nếu tạo mới: nạp giá trị mặc định theo defaultGroupId hoặc nhóm đầu tiên
  useEffect(() => {
    reset({
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || "",
      status:
        taskToEdit?.groupId ??
        taskToEdit?.status ??
        defaultGroupId ??
        groups[0]?.id ??
        1,
    });
  }, [taskToEdit, defaultGroupId, groups, reset]);

  // Logic hủy thao tác: reset lại dữ liệu của form và đóng modal
  function handleCancel() {
    reset({
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || "",
      status:
        taskToEdit?.groupId ??
        taskToEdit?.status ??
        defaultGroupId ??
        groups[0]?.id ??
        1, // Giá trị dự phòng để tránh undefined hoặc null
    });
    if (!onClose) return;
    onClose();
  }

  // Logic xử lý khi người dùng submit form hợp lệ:
  // 1. Chuẩn hóa chuỗi (trim) cho title và description
  // 2. Kiểm tra chế độ: nếu là Edit -> gọi onUpdateTask, nếu là Add -> gọi onAddTask
  // 3. Đóng form và reset sau khi hoàn tất
  function handleFormSubmit(data) {
    const taskPayload = {
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status,
      groupId: data.status,
    };

    if (isEditMode) {
      if (onUpdateTask) {
        onUpdateTask({
          ...taskToEdit,
          ...taskPayload,
        });
      }
      handleCancel();
      return;
    }

    if (onAddTask) {
      onAddTask(taskPayload);
    }

    handleCancel();
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      {/* Trường nhập tiêu đề công việc */}
      <div className="flex flex-col">
        <label
          htmlFor="task-title"
          className="text-[13px] font-semibold text-[#334155] mb-1.5"
        >
          Title <span className="text-[#ef4444]">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          className="border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2563eb]"
          placeholder="Enter Title Job..."
          {...register("title")}
        />
        {/* Hiển thị thông báo lỗi validate của trường Title */}
        {errors.title && (
          <p className="m-0 mt-1 text-xs text-[#ef4444]">
            {errors.title.message || errors.title}
          </p>
        )}
      </div>

      {/* Trường nhập mô tả chi tiết công việc */}
      <div className="flex flex-col">
        <label
          htmlFor="task-description"
          className="text-[13px] font-semibold text-[#334155] mb-1.5"
        >
          Describe <span className="text-[#ef4444]">*</span>
        </label>
        <textarea
          id="task-description"
          rows="4"
          className="border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm outline-none resize-y focus:border-[#2563eb]"
          placeholder="Enter Describe Job..."
          {...register("description")}
        />
        {/* Hiển thị thông báo lỗi validate của trường Description */}
        {errors.description && (
          <p className="m-0 mt-1 text-xs text-[#ef4444]">
            {errors.description.message || errors.description}
          </p>
        )}
      </div>

      {/* Chọn trạng thái/nhóm của công việc */}
      <div className="flex flex-col">
        <label
          htmlFor="task-status"
          className="text-[13px] font-semibold text-[#334155] mb-1.5"
        >
          Status
        </label>
        <select
          id="task-status"
          className="border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm outline-none bg-white cursor-pointer"
          {...register("status")}
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>
      </div>

      {/* Các nút hành động Cancel / Save */}
      <div className="flex justify-end gap-2.5 border-t border-[#f1f5f9] pt-4">
        <Button variant="cancel" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="save" type="submit">
          {isEditMode ? "Submit" : "Save"}
        </Button>
      </div>
    </form>
  );
}
