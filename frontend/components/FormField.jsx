export default function FormField({ field, value, error, onChange, onBlur }) {
  const id = `field-${field.name}`;
  const helperText = field.required ? field.helper : `${field.helper} You can leave this blank if you do not know it.`;

  return (
    <label className="form-field" htmlFor={id}>
      <span className="form-field__label">
        {field.label}
        {field.required ? <span className="form-field__required">Required</span> : <span className="form-field__optional">Optional</span>}
      </span>
      {field.kind === 'select' ? (
        <select id={id} name={field.name} value={value} onChange={onChange} onBlur={onBlur} aria-invalid={Boolean(error)}>
          <option value="">{field.optionalLabel ?? 'Select an option'}</option>
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
      <span className="form-field__help">{helperText}</span>
      {error ? <span className="form-field__error">{error}</span> : null}
    </label>
  );
}
