const PencilIcon = ({
  width = 24,
  height = 24,
  color = 'currentColor',
  className = '',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 26 26"
      className={className}
      fill={color}
    >
      <g fillRule="evenodd" clipRule="evenodd">
        <path d="M6.944 14.79a.5.5 0 0 1 .141-.277L17.163 4.435a.5.5 0 0 1 .707 0l3.89 3.89a.5.5 0 0 1 0 .706L11.68 19.11a.5.5 0 0 1-.277.14l-4.595.706a.5.5 0 0 1-.57-.57zm.964.314l-.577 3.76l3.759-.578l9.609-9.608l-3.183-3.182z" />
        <path d="m18.472 11.173l-3.537-3.53l.707-.708l3.536 3.53z" />
        <path d="M13 24.5c6.351 0 11.5-5.149 11.5-11.5S19.351 1.5 13 1.5S1.5 6.649 1.5 13S6.649 24.5 13 24.5m0 1c6.904 0 12.5-5.596 12.5-12.5S19.904.5 13 .5S.5 6.096.5 13S6.096 25.5 13 25.5" />
      </g>
    </svg>
  );
};

export default PencilIcon;

export const BrandIcon = (props) => (
  <svg
    width={17}
    height={17}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={8.72461} cy={8.5} r={8.17188} fill="#D9D9D9" />
    <path
      d="M13.7369 3.39307H3.71289V5.20878H13.7369V3.39307Z"
      fill="url(#paint0_linear_582_2102)"
    />
    <path
      d="M12.7402 7.5288H4.71094V5.80859H8.30654L12.7402 6.84955V7.5288Z"
      fill="#0B1C2D"
    />
    <path
      d="M7.24372 8.12842H5.77539V13.6066H7.24372V8.12842Z"
      fill="#00C3C0"
    />
    <path
      d="M9.45661 13.6066H7.98828V8.12842L9.45661 8.56414V13.6066Z"
      fill="#00C3C0"
    />
    <path
      d="M11.6746 13.6053H10.2051V8.76221L11.6746 9.14779V13.6053Z"
      fill="#00C3C0"
    />
    <defs>
      <linearGradient
        id="paint0_linear_582_2102"
        x1={13.7369}
        y1={4.30092}
        x2={3.71289}
        y2={4.30092}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF8602" />
        <stop offset={1} stopColor="#01C3C0" />
      </linearGradient>
    </defs>
  </svg>
);
