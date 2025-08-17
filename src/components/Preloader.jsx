import React from 'react';

export default function Preloader() {
  return (
    <div className="loader-container">
      <img
        src="/assets/img/preloader.gif"
        width="70"
        height="70"
        alt="loader"
      />
    </div>
  );
}
// export default function Preloader() {
//   return (
//     <div className="loader-container">
//       <div className="holder">
//         <div className="box"></div>
//       </div>
//       <div className="holder">
//         <div className="box"></div>
//       </div>
//       <div className="holder">
//         <div className="box"></div>
//       </div>
//     </div>
//   );
// }
