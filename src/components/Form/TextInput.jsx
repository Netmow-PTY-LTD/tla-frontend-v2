import { useField } from "formik";

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="tla-form-label mb-2 inline-block"
      >
        {label}
      </label>
      <input
        className="tla-form-control"
        {...field}
        {...props}
        value={field.value || props.value}
      />
      {meta.touched && meta.error ? (
        <div className="error mt-2 text-sm text-red-400">{meta.error}</div>
      ) : null}
    </>
  );
};

export default TextInput;
