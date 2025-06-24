const CardDisplay = ({
  cardLastFour = 4784,
  expiryMonth = 4,
  expiryYear = 2029,
}) => {
  // Format month with leading 0 if needed
  const formattedMonth = expiryMonth.toString().padStart(2, '0');

  // Get last 2 digits of year
  const formattedYear = expiryYear.toString().slice(-2);
  return (
    <div className="relative">
      <div className="w-80 h-48 bg-gradient-to-br bg-[#26365F] rounded-2xl p-6 text-white shadow-xl">
        {/* Card Header */}
        <div className="mb-8">
          <h2 className="text-xl font-medium">My Card</h2>
        </div>

        {/* Card Number */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 text-lg font-mono">
            <span className="tracking-wider">••••</span>
            <span className="tracking-wider">••••</span>
            <span className="tracking-wider">••••</span>
            <span className="tracking-wider font-semibold">{cardLastFour}</span>
          </div>
        </div>

        {/* Expiry Date */}
        <div>
          <span className="text-lg font-mono">
            {formattedMonth}/{formattedYear}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
