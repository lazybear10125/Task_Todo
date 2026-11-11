import "./ui/TaskModal.css";

export default function TaskModal({
  isOpen,
  groups = [],
  formData = { title: "", description: "", status: "" },
  errors = {},
  onChange,
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
          <h2 className="modal-title">Thêm Công Việc Mới</h2>
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
              name="title"
              type="text"
              className="form-input"
              placeholder="Nhập tiêu đề công việc..."
              value={formData.title || ""}
              onChange={onChange}
            />
            {errors.title && (
              <p className="error-message">{errors.title}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="task-description" className="form-label">
              Mô Tả <span className="required-mark">*</span>
            </label>
            <textarea
              id="task-description"
              name="description"
              rows="4"
              className="form-textarea"
              placeholder="Nhập mô tả chi tiết công việc..."
              value={formData.description || ""}
              onChange={onChange}
            />
            {errors.description && (
              <p className="error-message">{errors.description}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="task-status" className="form-label">
              Trạng thái
            </label>
            <select
              id="task-status"
              name="status"
              className="form-select"
              value={formData.status || ""}
              onChange={onChange}
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
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
