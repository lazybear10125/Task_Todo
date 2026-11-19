// Component Modal hiển thị dạng cửa sổ nổi (Popup Overlay)
export default function Modal({ isOpen, onClose, title, children }) {
  // Nếu modal không được mở (isOpen = false), không render bất cứ gì vào DOM
  if (!isOpen) {
    return null;
  }

  return (
    // Lớp nền đen mờ bao phủ toàn màn hình (Backdrop): click vào lớp nền này sẽ đóng modal
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50"
      onClick={onClose}
    >
      {/* Khung nội dung chính của Modal: dùng stopPropagation để ngăn sự kiện click lan ra lớp nền gây đóng modal ngoài ý muốn */}
      <div
        className="bg-white rounded-xl w-full max-w-110 p-6 shadow-[0_10px_25px_rgba(0,0,0,0.15)] flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Phần tiêu đề Modal và nút đóng (✕) */}
        <div className="flex justify-between items-center border-b border-[#f1f5f9] pb-3">
          <h2 className="m-0 text-[18px] font-bold text-[#0f172a]">{title}</h2>
          <button
            type="button"
            className="bg-transparent border-0 text-[18px] text-[#94a3b8] hover:text-[#475569] cursor-pointer p-0 leading-none"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Nội dung bên trong Modal (thường là TaskForm) */}
        {children}
      </div>
    </div>
  );
}
