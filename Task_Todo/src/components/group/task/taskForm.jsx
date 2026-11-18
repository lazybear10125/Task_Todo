import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "../../../schema/taskSchema";
import Button from "../../button/button";

export default function TaskForm({
  groups = [],
  defaultGroupId,
  taskToEdit = null,
  isEditMode = false,
  onClose,
  onAddTask,
  onUpdateTask,
}) {
  // const getDefaultValues = useCallback(
  //   () => ({
  //     title: taskToEdit?.title || "",
  //     description: taskToEdit?.description || "",
  //     status:
  //       taskToEdit?.groupId ??
  //       taskToEdit?.status ??
  //       defaultGroupId ??
  //       groups[0]?.id ??
  //       1,
  //   }),
  //   [taskToEdit, defaultGroupId, groups],
  // );

  // Luu State vao thang  or useEffect

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

  function handleCancel() {
    reset({
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || "",
      status:
        taskToEdit?.groupId ??
        taskToEdit?.status ??
        defaultGroupId ??
        groups[0]?.id ??
        1, //Cho no khong tra ve undefind or Null
    });
    if (!onClose) return;
    onClose();
  }

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
        {errors.title && (
          <p className="m-0 mt-1 text-xs text-[#ef4444]">
            {errors.title.message || errors.title}
          </p>
        )}
      </div>

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
        {errors.description && (
          <p className="m-0 mt-1 text-xs text-[#ef4444]">
            {errors.description.message || errors.description}
          </p>
        )}
      </div>

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
