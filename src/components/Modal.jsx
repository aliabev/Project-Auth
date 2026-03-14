import Button from './Button';

export default function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div className="modal-body">{children}</div>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
