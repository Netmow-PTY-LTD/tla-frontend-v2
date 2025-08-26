import Cookies from 'js-cookie';
import countries from '@/data/countries.json'; // adjust path
import { Modal } from '@/components/UIComponents/Modal';

export default function ShowCountriesListModal({
  isModalOpen,
  setIsModalOpen,
  setSelectedCountry,
  selectedCountry, // ✅ add this prop from parent
}) {
  const handleSelect = (country) => {
    Cookies.set('countryObj', JSON.stringify(country), { expires: 3650 });
    setSelectedCountry(country);
    setIsModalOpen(false);
    window.location.reload();
  };

  return (
    <Modal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      title="Select Your Country"
    >
      <div className="flex flex-col justify-center items-center">
        <h4 className="mb-8 text-center font-semibold">Choose Country</h4>
        <ul>
          {countries.map((country) => {
            const isSelected = selectedCountry?.code === country.code;
            return (
              <li
                key={country.countryId || country.code}
                className={`flex items-center gap-3 mb-2 p-2 rounded-sm transition ${
                  isSelected ? 'border border-[#f3f3f3]' : '' // only selected has border
                }`}
                // onClick={() => handleSelect(country)}
              >
                {country.flag && (
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="w-8 h-6 object-cover rounded-sm"
                  />
                )}
                <span className="font-medium">{country.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}
