import { useState } from "react";
import TaskModal from "../components/TaskModal";

export default function TaskModalContainer({
  isOpen,
  onClose,
  closeModal,
  groups = [],
  defaultGroupId,
  onAddTask,
}) {
  const handleCloseCallback = onClose || closeModal;

  const [formData, setFormData] = useState(function () {
    return {
      title: "",
      description: "",
      status: defaultGroupId || (groups[0]?.id ?? "todo"),
    };
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) {
    return null;
  }

  function handleClose() {
    setFormData({
      title: "",
      description: "",
      status: defaultGroupId || (groups[0]?.id ?? "todo"),
    });
    setErrors({});
    if (handleCloseCallback) {
      handleCloseCallback();
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(function (prev) {
      return {
        ...prev,
        [name]: value,
      };
    });

    if (errors[name]) {
      setErrors(function (prev) {
        return {
          ...prev,
          [name]: "",
        };
      });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      groupId: formData.status,
    };

    if (onAddTask) {
      onAddTask(newTask);
    }
    handleClose();
  }

  return (
    <TaskModal
      isOpen={isOpen}
      groups={groups}
      formData={formData}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onClose={handleClose}
      closeModal={handleClose}
    />
  );
}
