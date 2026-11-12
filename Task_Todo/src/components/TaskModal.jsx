export default function TaskModal({
  isOpen,
  groups = [],
  formData = {},
  onChange,
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
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-[440px] p-6 shadow-[0_10px_25px_rgba(0,0,0,0.15)] flex flex-col gap-4"
        onClick={function (e) {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-between items-center border-b border-[#f1f5f9] pb-3">
          <h2 className="m-0 text-[18px] font-bold text-[#0f172a]">
            {isEditMode ? "EditingTask" : "AddTask"}
          </h2>
          <button
            type="button"
            className="bg-transparent border-0 text-[18px] text-[#94a3b8] hover:text-[#475569] cursor-pointer p-0 leading-none"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex flex-col">
            <label
              htmlFor="task-title"
              className="text-[13px] font-semibold text-[#334155] mb-1.5"
            >
              Title <span className="text-[#ef4444]">*</span>
            </label>
            <input
              id="task-title"
              name="title"
              type="text"
              className="border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2563eb]"
              placeholder="Enter Title Job..."
              {...(register
                ? register("title")
                : { value: formData.title || "", onChange })}
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
              name="description"
              rows="4"
              className="border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm outline-none resize-y focus:border-[#2563eb]"
              placeholder="Enter Describe Job..."
              {...(register
                ? register("description")
                : { value: formData.description || "", onChange })}
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
              name="status"
              className="border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm outline-none bg-white cursor-pointer"
              {...(register
                ? register("status")
                : { value: formData.status ?? "", onChange })}
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
              onClick={handleClose}
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
      </div>
    </div>
  );
}
