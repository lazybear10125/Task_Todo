import { useState, useRef, useEffect } from "react";
import Button from "../button/button";

export default function GroupMenu({
  groupId,
  onAddTask,
  onDeleteGroup,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  onClose: controlledOnClose,
}) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const menuRef = useRef(null);

  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : localIsOpen;

  const handleClose = () => {
    if (!isControlled) {
      setLocalIsOpen(false);
      return;
    }

    controlledOnClose?.();
  };

  const handleToggle = (e) => {
    e.stopPropagation();

    if (!isControlled) {
      setLocalIsOpen((prev) => !prev);
      return;
    }

    controlledOnToggle?.();
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (!menuRef.current || menuRef.current.contains(event.target)) return;

      if (!isControlled) {
        setLocalIsOpen(false);
        return;
      }

      controlledOnClose?.();
    }
    // event onClick duoc goi va luu
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // Can xoa event tranh tinh tranh nhieu Listener
  }, [isOpen, isControlled, controlledOnClose]);

  function handleAddTask() {
    onAddTask?.(groupId);
    handleClose();
  }

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
