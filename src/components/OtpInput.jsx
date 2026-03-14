import { useRef } from 'react';

export default function OtpInput({ value, onChange, error }) {
  const refs = useRef([]);
  const digits = value.padEnd(6, ' ').slice(0, 6).split('');

  const setDigit = (idx, char) => {
    const clean = char.replace(/\D/g, '');
    const current = value.padEnd(6, ' ').split('');
    if (!clean) {
      current[idx] = ' ';
      onChange(current.join('').trimEnd());
      return;
    }
    current[idx] = clean[0];
    onChange(current.join('').replace(/\s+$/g, ''));
    if (idx < 5) refs.current[idx + 1]?.focus();
  };

  const onPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    refs.current[Math.min(pasted.length, 6) - 1]?.focus();
  };

  return (
    <div className="field-wrap">
      <label>Verification code</label>
      <div className="otp-row" onPaste={onPaste}>
        {digits.map((d, idx) => (
          <input
            key={idx}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            value={d === ' ' ? '' : d}
            onChange={(e) => setDigit(idx, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
                refs.current[idx - 1]?.focus();
              }
            }}
            className={`${error ? 'has-error' : ''} otp-cell`}
          />
        ))}
      </div>
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
