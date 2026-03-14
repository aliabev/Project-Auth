export default function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = true,
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
