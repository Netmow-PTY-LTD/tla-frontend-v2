export default function FileUploader({
  label = 'Upload File',
  onChange,
  accept = '*',
  multiple = false,
  width = 'max-w-sm',
  icon,
}) {
  return (
    <div className={`${width} `}>
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center w-full  px-5 py-4 border border-dashed border-gray-300 rounded-2xl cursor-pointer text-center hover:bg-gray-50 transition`}
      >
        {icon}
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={onChange}
          accept={accept}
          multiple={multiple}
        />
      </label>
      <p className="text-gray-700 font-medium text-center mt-2">{label}</p>
    </div>
  );
}
