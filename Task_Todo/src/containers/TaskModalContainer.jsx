import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "../schema/taskSchema";
import TaskModal from "../components/TaskModal";

export default function TaskModalContainer({
  isOpen,
  onClose,
  closeModal,
  groups = [],
  defaultGroupId,
  taskToEdit = null,
  onAddTask,
  onUpdateTask,
}) {
  const handleCloseCallback = onClose || closeModal;
  const isEditMode = Boolean(taskToEdit);

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
    if (isOpen) {
      reset(getDefaultValues());
    }
  }, [isOpen, getDefaultValues, reset]);

  function handleClose() {
    reset(getDefaultValues());
    if (handleCloseCallback) {
      handleCloseCallback();
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

    handleClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <TaskModal
      isOpen={isOpen}
      groups={groups}
      register={register}
      errors={errors}
      isEditMode={isEditMode}
      onSubmit={handleSubmit(handleFormSubmit)}
      onClose={handleClose}
      closeModal={handleClose}
    />
  );
}
