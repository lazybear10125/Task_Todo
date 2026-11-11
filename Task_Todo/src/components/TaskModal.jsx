import "./ui/TaskModal.css";

export default function TaskModal({
  isOpen,
  groups = [],
  register,
  errors = {},
  isEditMode = false,
  onSubmit,
  onClose,
  closeModal,
}) {
  const handleClose = onClose || closeModal;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="task-modal-overlay" onClick={handleClose}>
      <div
        className="task-modal"
        onClick={function (e) {
          e.stopPropagation();
        }}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditMode ? "Chỉnh Sửa Công Việc" : "Thêm Công Việc Mới"}
          </h2>
          <button type="button" className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form className="task-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Tiêu Đề <span className="required-mark">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className="form-input"
              placeholder="Nhập tiêu đề công việc..."
              {...(register ? register("title") : {})}
            />
            {errors.title && (
              <p className="error-message">{errors.title.message || errors.title}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="task-description" className="form-label">
              Mô Tả <span className="required-mark">*</span>
            </label>
            <textarea
              id="task-description"
              rows="4"
              className="form-textarea"
              placeholder="Nhập mô tả chi tiết công việc..."
              {...(register ? register("description") : {})}
            />
            {errors.description && (
              <p className="error-message">
                {errors.description.message || errors.description}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="task-status" className="form-label">
              Trạng thái
            </label>
            <select
              id="task-status"
              className="form-select"
              {...(register ? register("status") : {})}
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

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleClose}
            >
              Hủy
            </button>
            <button type="submit" className="submit-button">
              {isEditMode ? "Cập Nhật" : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
