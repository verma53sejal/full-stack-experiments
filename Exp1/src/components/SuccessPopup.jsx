export default function SuccessPopup({ message }) {
  if (!message) return null;
  return <div className="toast" role="status">✅ <span>{message}</span></div>;
}
