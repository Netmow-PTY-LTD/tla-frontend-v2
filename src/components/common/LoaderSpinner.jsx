// import React from 'react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Spinner } from 'reactstrap';

// const LoaderSpiner = (props) => {
//   return (
//     <>
//       <div className=" px-3 text-light d-flex justify-content-center">
//         <Spinner> Loading... </Spinner>
//       </div>
//       {toast.error(props.error, {
//         position: 'top-right',
//         hideProgressBar: false,
//         progress: undefined,
//         toastId: '',
//       })}
//     </>
//   );
// };

// export default LoaderSpiner;

import classNames from 'classnames';

export const LoaderSpinner = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={classNames('animate-spin', className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
