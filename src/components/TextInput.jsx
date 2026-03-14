import { useState } from 'react';

export default function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  autoFocus = false,
}) {
  const [focused, setFocused] = useState(autoFocus);
  return (
    <div className="field-wrap">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`${error ? 'has-error' : ''} ${focused ? 'is-focused' : ''} ${value ? 'is-filled' : ''}`}
      />
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
