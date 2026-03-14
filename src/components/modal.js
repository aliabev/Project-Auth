export const modal = ({ open }) =>
  !open
    ? ''
    : `<div class="modal-overlay" id="help-overlay">
      <div class="modal-card">
        <h3>Need help?</h3>
        <p>Support phone: <a href="tel:+18005550199">+1 (800) 555-0199</a></p>
        <button id="open-chat" class="btn btn-primary">Open support chat</button>
        <button id="close-help" class="btn btn-secondary">Close</button>
      </div>
    </div>`;
