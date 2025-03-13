import { useField } from "formik";

const TextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="tla-form-label mb-2 inline-block"
      >
        {label}
      </label>
      <textarea
        className="tla-form-textarea"
        rows="5"
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

export default TextArea;
