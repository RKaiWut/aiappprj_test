export default function FormField({ field, value, error, onChange, onBlur }) {
  const id = `field-${field.name}`;
  
  // Helper text position: above label for radio inputs, below for others
  const showHelperAbove = field.inputType === 'radio';
  const helperText = field.required ? field.helper : `${field.helper} You can leave this blank if you do not know it.`;

  return (
    <label className="form-field" htmlFor={id}>
      {showHelperAbove ? (
        <span className="form-field__help">{helperText}</span>
      ) : null}
      
      <span className="form-field__label">
        {field.label}
        {field.required ? <span className="form-field__required">Required</span> : <span className="form-field__optional">Optional</span>}
      </span>
      
      {field.kind === 'triage' && field.inputType === 'radio' ? (
        // Triage mode: show 3 yes/no questions for chest pain
        <div className="triage-group">
          {field.options.map((question, index) => (
            <div key={question.id} className="triage-question">
              <span className="triage-question__label">{question.label}</span>
              <div className="radio-options">
                {question.options.map((option) => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      id={`${id}-${question.id}-${option.value}`}
                      name={`${field.name}-${question.id}`}
                      value={option.value}
                      checked={String(value) === String(option.value)}
                      onChange={onChange}
                      onBlur={onBlur}
                      aria-invalid={Boolean(error)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : field.kind === 'select' && field.inputType === 'radio' ? (
        // Regular radio buttons for select fields
        <div className="radio-group">
          {field.options.map((option) => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                id={`${id}-${option.value}`}
                name={field.name}
                value={option.value}
                checked={String(value) === String(option.value)}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={Boolean(error)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      ) : field.kind === 'select' && field.inputType === 'triage' ? (
        // Triage mode: show bypass dropdown
        <select id={id} name={field.name} value={value} onChange={onChange} onBlur={onBlur} aria-invalid={Boolean(error)}>
          <option value="">{field.helper}</option>
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
      
      {!showHelperAbove && error ? <span className="form-field__error">{error}</span> : null}
    </label>
  );
}
