export const button = ({ id, label, variant = 'primary', disabled = false }) =>
  `<button id="${id}" class="btn btn-${variant}" ${disabled ? 'disabled' : ''}>${label}</button>`;
