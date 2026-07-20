export default function FormField({ field, value, error, onChange, onBlur }) {
  const id = `field-${field.name}`;

  return (
    <label className="form-field" htmlFor={id}>
      <span className="form-field__label">{field.label}</span>
      {field.kind === 'select' ? (
        <select id={id} name={field.name} value={value} onChange={onChange} onBlur={onBlur} aria-invalid={Boolean(error)}>
          <option value="">Select an option</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.inputType}
          min={field.min}
          max={field.max}
          step={field.step}
          placeholder={field.placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          inputMode={field.inputType === 'number' ? 'decimal' : undefined}
          aria-invalid={Boolean(error)}
        />
      )}
      <span className="form-field__help">{field.helper}</span>
      {error ? <span className="form-field__error">{error}</span> : null}
    </label>
  );
}
