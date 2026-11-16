import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "../../schema/taskSchema";

export default function TaskForm({
  groups = [],
  defaultGroupId,
  taskToEdit = null,
  isEditMode = false,
  onClose,
  onAddTask,
  onUpdateTask,
}) {
  const getDefaultValues = useCallback(
    () => ({
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || "",
      status:
        taskToEdit?.groupId ??
        taskToEdit?.status ??
        defaultGroupId ??
        groups[0]?.id ??
        1,
    }),
    [taskToEdit, defaultGroupId, groups],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    reset(getDefaultValues());
  }, [getDefaultValues, reset]);

  function handleCancel() {
    reset(getDefaultValues());
    if (onClose) {
      onClose();
    }
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
    } else {
      if (onAddTask) {
        onAddTask(taskPayload);
      }
    }

    handleCancel();
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleFormSubmit)}>
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
          {groups.map(function (group) {
            return (
              <option key={group.id} value={group.id}>
                {group.title}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex justify-end gap-2.5 border-t border-[#f1f5f9] pt-4">
        <button
          type="button"
          className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] border border-[#cbd5e1] px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-0 px-[18px] py-2 rounded-lg text-sm font-semibold cursor-pointer"
        >
          {isEditMode ? "Submit" : "Save"}
        </button>
      </div>
    </form>
  );
}
