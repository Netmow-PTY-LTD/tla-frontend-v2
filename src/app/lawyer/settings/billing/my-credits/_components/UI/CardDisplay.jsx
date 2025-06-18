const CardDisplay = () => {
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
            <span className="tracking-wider font-semibold">4784</span>
          </div>
        </div>

        {/* Expiry Date */}
        <div>
          <span className="text-lg font-mono">06/28</span>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
