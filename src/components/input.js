export const textInput = ({ id, label, value = '', placeholder = '', error = '' }) => `
  <div class="field-wrap">
    <label for="${id}">${label}</label>
    <input id="${id}" value="${value}" placeholder="${placeholder}" class="${error ? 'has-error' : ''} ${value ? 'is-filled' : ''}" />
    ${error ? `<p class="field-error">${error}</p>` : ''}
  </div>
`;

export const passwordInput = ({ id, label, value = '', error = '' }) => `
  <div class="field-wrap">
    <label for="${id}">${label}</label>
    <div class="password-row">
      <input id="${id}" type="password" value="${value}" class="${error ? 'has-error' : ''} ${value ? 'is-filled' : ''}" />
      <button id="toggle-password" class="toggle-plain" type="button">Show</button>
    </div>
    ${error ? `<p class="field-error">${error}</p>` : ''}
  </div>
`;
