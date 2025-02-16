import PropTypes from "prop-types";
import React from "react";

const FormInput = React.forwardRef(
  (
    {
      label,
      type = "text",
      name,
      value,
      onChange,
      onKeyDown,
      placeholder,
      required = false,
      icon,
      step,
      min,
      error,
    },
    ref,
  ) => {
    const IconComponent = icon ? icon : null;
    return (
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-300"
        >
          {label}
        </label>
        <div className="relative mt-1 rounded-sm shadow-sm">
          {IconComponent && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <IconComponent
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          )}
          <input
            id={name}
            ref={ref}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            required={required}
            placeholder={placeholder}
            step={step}
            min={min}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${name}-error` : undefined}
            className={`block w-full rounded-md border bg-gray-700 px-3 py-2 ${IconComponent ? "pl-10" : "pl-3"} placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none sm:text-sm ${error ? "border-red-500" : "border-gray-600"} `}
          />
        </div>
        {error && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;

FormInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  icon: PropTypes.object,
  step: PropTypes.string,
  min: PropTypes.string,
  error: PropTypes.string,
};
