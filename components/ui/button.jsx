"use client";

export function Button({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold transition active:scale-95";

  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700",
    outline: "border border-gray-400 hover:bg-gray-100",
    ghost: "hover:bg-gray-200",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
