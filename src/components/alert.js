export const alertBanner = ({ type = 'info', message = '' }) =>
  message ? `<div class="alert alert-${type}">${message}</div>` : '';
