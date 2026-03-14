import { useState } from 'react';

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  error,
  capsLockOn,
}) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div className="field-wrap">
      <label htmlFor={id}>{label}</label>
      <div className="password-row">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyUp={(e) => {
            if (e.getModifierState) {
              capsLockOn(e.getModifierState('CapsLock'));
            }
          }}
          className={`${error ? 'has-error' : ''} ${focused ? 'is-focused' : ''} ${value ? 'is-filled' : ''}`}
        />
        <button className="toggle-plain" type="button" onClick={() => setShow((prev) => !prev)}>
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
