export const otpInput = ({ value = '', error = '' }) => {
  const chars = value.padEnd(6, ' ').slice(0, 6).split('');
  return `
  <div class="field-wrap">
    <label>Verification code</label>
    <div class="otp-row" id="otp-row">
      ${chars
        .map(
          (c, i) =>
            `<input class="otp-cell ${error ? 'has-error' : ''}" inputmode="numeric" maxlength="1" data-otp-index="${i}" value="${c === ' ' ? '' : c}" />`,
        )
        .join('')}
    </div>
    ${error ? `<p class="field-error">${error}</p>` : ''}
  </div>`;
};
