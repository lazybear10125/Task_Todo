// Component Button dùng chung cho toàn bộ ứng dụng với các biến thể (variants) màu sắc và kiểu dáng định sẵn
export default function Button({
  variant = "add",
  type = "button",
  onClick,
  children,
  className = "",
  disabled = false,
  ...props
}) {
  // Bản đồ định nghĩa phong cách màu sắc tương ứng cho từng biến thể (variant)
  const variantStyles = {
    add: "bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-0",
    edit: "bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] border-0",
    delete:
      "bg-[#fef2f2] hover:bg-[#fee2e2] text-[#dc2626] border border-[#fecaca]",
    save: "bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-0",
    cancel:
      "bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] border border-[#cbd5e1]",
  };

  // Lấy style tương ứng với variant truyền vào, nếu không khớp thì dùng mặc định là variant 'add'
  const selectedVariantStyle = variantStyles[variant] || variantStyles.add;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer font-semibold rounded-lg px-3.5 py-2 text-sm transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${selectedVariantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
