import { useFormContext, useWatch } from 'react-hook-form';
import { Label } from '../ui/label';

export default function GenderRadioField() {
  const { setValue, control } = useFormContext();
  const gender = useWatch({ control, name: 'gender' });

  const handleGenderChange = (value) => {
    setValue('gender', value, { shouldValidate: true });
  };

  const genderOptions = [
    { id: 1, label: 'Male', value: 'male' },
    { id: 2, label: 'Female', value: 'female' },
    { id: 3, label: 'Other', value: 'other' },
  ];

  return (
    <div className="flex items-center">
      <Label className="w-1/6">Gender</Label>
      <div className="flex gap-6">
        {genderOptions.map((option) => (
          <label
            key={option.value}
            htmlFor={`gender-${option.value}`}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="radio"
              id={`gender-${option.value}`}
              name="gender"
              value={option.value}
              checked={gender === option.value}
              onChange={() => handleGenderChange(option.value)}
              className="hidden"
            />
            <div
              className={`w-4 h-4 rounded-full border-2 border-[var(--primary-color)] flex items-center justify-center transition-all
                ${
                  gender === option.value
                    ? 'bg-[var(--primary-color)]'
                    : 'bg-transparent'
                }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition
                  ${gender === option.value ? 'bg-white' : 'bg-transparent'}`}
              />
            </div>
            <span className="text-sm text-gray-800">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
