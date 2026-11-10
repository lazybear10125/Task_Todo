import "./ui/TaskModal.css";

export default function TaskModal({ isOpen, closeModal, groups }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="task-modal-overlay">
      <div className="task-modal">
        <div className="modal-header">
          <h2 className="modal-title">Thêm Công Việc Mới</h2>
          <button type="button" className="close-button" onClick={closeModal}>
            ✕
          </button>
        </div>

        <form className="task-form">
          <div className="form-group">
            <label className="form-label">
              Tieu De <span className="required-mark">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Nhap tieu de cong viec..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Mo Ta <span className="required-mark">*</span>
            </label>
            <textarea
              rows="4"
              className="form-textarea"
              placeholder="Nhap mo ta chi tiet cong viec..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-select">
              {groups &&
                groups.map(function (group) {
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
              onClick={closeModal}
            >
              Huy
            </button>
            <button type="button" className="submit-button">
              Luu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
