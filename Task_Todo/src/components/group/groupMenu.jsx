import { useState, useRef, useEffect } from "react";
import Button from "../button/button";

// Component menu tùy chọn (3 chấm) cho từng cột: hỗ trợ Thêm task và Xóa cột
export default function GroupMenu({
  groupId,
  onAddTask,
  onDeleteGroup,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  onClose: controlledOnClose,
}) {
  // State cục bộ sử dụng trong trường hợp component không được điều khiển từ bên ngoài (uncontrolled)
  const [localIsOpen, setLocalIsOpen] = useState(false);
  // Tham chiếu tới DOM node của menu để kiểm tra click outside
  const menuRef = useRef(null);

  // Xác định xem component đang chạy theo cơ chế Controlled (từ cha) hay Uncontrolled (nội bộ)
  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : localIsOpen;

  // Logic đóng menu: gọi callback từ props (nếu controlled) hoặc cập nhật state nội bộ
  const handleClose = () => {
    if (!isControlled) {
      setLocalIsOpen(false);
      return;
    }

    controlledOnClose?.();
  };

  // Logic bật/tắt menu: chặn sự kiện nổi bọt để không làm ảnh hưởng đến kéo thả
  const handleToggle = (e) => {
    e.stopPropagation();

    if (!isControlled) {
      setLocalIsOpen((prev) => !prev);
      return;
    }

    controlledOnToggle?.();
  };

  // Effect xử lý click ra ngoài (Click Outside) để tự động đóng dropdown menu
  useEffect(() => {
    // Nếu menu đang đóng thì không cần gắn sự kiện lắng nghe
    if (!isOpen) return;

    function handleClickOutside(event) {
      // Nếu click bên trong khu vực menu thì bỏ qua
      if (!menuRef.current || menuRef.current.contains(event.target)) return;

      // Click bên ngoài menu: tiến hành đóng
      if (!isControlled) {
        setLocalIsOpen(false);
        return;
      }

      controlledOnClose?.();
    }

    // Đăng ký sự kiện mousedown trên toàn bộ document
    document.addEventListener("mousedown", handleClickOutside);

    // Dọn dẹp sự kiện khi component unmount hoặc khi menu đóng lại để tránh leak memory
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isControlled, controlledOnClose]);

  // Logic xử lý khi chọn "Add Task" trong menu
  function handleAddTask() {
    onAddTask?.(groupId);
    handleClose();
  }

  // Logic xử lý khi chọn "Delete Group" trong menu
  function handleDeleteGroup() {
    onDeleteGroup?.(groupId);
    handleClose();
  }

  return (
    <div
      ref={menuRef}
      className="relative inline-block"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Nút bấm 3 chấm để mở menu */}
      <button
        type="button"
        title="Group menu"
        aria-label="Group menu"
        className="p-1.5 text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0] rounded-md cursor-pointer transition-colors flex items-center justify-center border-0 bg-transparent"
        onClick={handleToggle}
      >
        <svg
          className="w-4 h-4 fill-current pointer-events-none"
          viewBox="0 0 24 24"
        >
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>

      {/* Dropdown danh sách hành động hiển thị khi isOpen = true */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-30 bg-white border border-[#e2e8f0] rounded-lg shadow-lg p-2 flex flex-col gap-1.5 min-w-32.5">
          <Button
            variant="add"
            className="text-xs px-2.5 py-1.5 w-full justify-start"
            onClick={handleAddTask}
          >
            Add Task
          </Button>

          {onDeleteGroup && (
            <Button
              variant="delete"
              className="text-xs px-2.5 py-1.5 w-full justify-start"
              onClick={handleDeleteGroup}
            >
              Delete Group
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
