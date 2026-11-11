import { useEffect } from "react";
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
      status: defaultGroupId || (groups[0]?.id ?? "todo"),
    },
  });

  useEffect(
    function () {
      if (isOpen) {
        if (taskToEdit) {
          reset({
            title: taskToEdit.title || "",
            description: taskToEdit.description || "",
            status: taskToEdit.groupId || taskToEdit.status || defaultGroupId || "todo",
          });
        } else {
          reset({
            title: "",
            description: "",
            status: defaultGroupId || (groups[0]?.id ?? "todo"),
          });
        }
      }
    },
    [isOpen, taskToEdit, defaultGroupId, groups, reset],
  );

  if (!isOpen) {
    return null;
  }

  function handleClose() {
    reset({
      title: "",
      description: "",
      status: defaultGroupId || (groups[0]?.id ?? "todo"),
    });
    if (handleCloseCallback) {
      handleCloseCallback();
    }
  }

  function handleFormSubmit(data) {
    if (isEditMode) {
      if (onUpdateTask) {
        onUpdateTask({
          ...taskToEdit,
          title: data.title.trim(),
          description: data.description.trim(),
          status: data.status,
          groupId: data.status,
        });
      }
    } else {
      if (onAddTask) {
        onAddTask({
          title: data.title.trim(),
          description: data.description.trim(),
          status: data.status,
          groupId: data.status,
        });
      }
    }
    handleClose();
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
