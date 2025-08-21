import { Modal } from "@/components/UIComponents/Modal";

export default function ShowCountriesListModal({isModalOpen, setIsModalOpen}){
  return(
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen} title="Select Your Country">
      <div>
        <h4 className="mb-8">Choose Country</h4>
        <ul>
          <li className="flex items-center gap-3 mb-3 border border-[#efefef] p-2 rounded-sm">
            <svg width="31" height="23" viewBox="0 0 31 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1941_9591)">
              <path d="M0.867188 0.416992H30.8672V22.917H0.867188V0.416992Z" fill="#012169"/>
              <path d="M4.38281 0.416992L15.8203 8.90137L27.2109 0.416992H30.8672V3.32324L19.6172 11.7139L30.8672 20.0576V22.917H27.1172L15.8672 14.5264L4.66406 22.917H0.867188V20.1045L12.0703 11.7607L0.867188 3.41699V0.416992H4.38281Z" fill="white"/>
              <path d="M20.7422 13.5889L30.8672 21.042V22.917L18.1641 13.5889H20.7422ZM12.1172 14.5264L12.3984 16.167L3.39844 22.917H0.867188L12.1172 14.5264ZM30.8672 0.416992V0.557617L19.1953 9.37012L19.2891 7.30762L28.5234 0.416992H30.8672ZM0.867188 0.416992L12.0703 8.66699H9.25781L0.867188 2.38574V0.416992Z" fill="#C8102E"/>
              <path d="M12.1641 0.416992V22.917H19.6641V0.416992H12.1641ZM0.867188 7.91699V15.417H30.8672V7.91699H0.867188Z" fill="white"/>
              <path d="M0.867188 9.46387V13.9639H30.8672V9.46387H0.867188ZM13.6641 0.416992V22.917H18.1641V0.416992H13.6641Z" fill="#C8102E"/>
              </g>
              <defs>
              <clipPath id="clip0_1941_9591">
              <rect x="0.867188" y="0.416992" width="30" height="22.5" rx="1" fill="white"/>
              </clipPath>
              </defs>
            </svg>
            <span className='font-medium'>United Kingdom</span>
          </li>
          <li className="flex items-center gap-3 mb-3 border border-[#efefef] p-2 rounded-sm">
            <svg width="31" height="23" viewBox="0 0 31 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1941_9591)">
              <path d="M0.867188 0.416992H30.8672V22.917H0.867188V0.416992Z" fill="#012169"/>
              <path d="M4.38281 0.416992L15.8203 8.90137L27.2109 0.416992H30.8672V3.32324L19.6172 11.7139L30.8672 20.0576V22.917H27.1172L15.8672 14.5264L4.66406 22.917H0.867188V20.1045L12.0703 11.7607L0.867188 3.41699V0.416992H4.38281Z" fill="white"/>
              <path d="M20.7422 13.5889L30.8672 21.042V22.917L18.1641 13.5889H20.7422ZM12.1172 14.5264L12.3984 16.167L3.39844 22.917H0.867188L12.1172 14.5264ZM30.8672 0.416992V0.557617L19.1953 9.37012L19.2891 7.30762L28.5234 0.416992H30.8672ZM0.867188 0.416992L12.0703 8.66699H9.25781L0.867188 2.38574V0.416992Z" fill="#C8102E"/>
              <path d="M12.1641 0.416992V22.917H19.6641V0.416992H12.1641ZM0.867188 7.91699V15.417H30.8672V7.91699H0.867188Z" fill="white"/>
              <path d="M0.867188 9.46387V13.9639H30.8672V9.46387H0.867188ZM13.6641 0.416992V22.917H18.1641V0.416992H13.6641Z" fill="#C8102E"/>
              </g>
              <defs>
              <clipPath id="clip0_1941_9591">
              <rect x="0.867188" y="0.416992" width="30" height="22.5" rx="1" fill="white"/>
              </clipPath>
              </defs>
            </svg>
            <span className='font-medium'>United Kingdom</span>
          </li>
          <li className="flex items-center gap-3 mb-3 border border-[#efefef] p-2 rounded-sm">
            <svg width="31" height="23" viewBox="0 0 31 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1941_9591)">
              <path d="M0.867188 0.416992H30.8672V22.917H0.867188V0.416992Z" fill="#012169"/>
              <path d="M4.38281 0.416992L15.8203 8.90137L27.2109 0.416992H30.8672V3.32324L19.6172 11.7139L30.8672 20.0576V22.917H27.1172L15.8672 14.5264L4.66406 22.917H0.867188V20.1045L12.0703 11.7607L0.867188 3.41699V0.416992H4.38281Z" fill="white"/>
              <path d="M20.7422 13.5889L30.8672 21.042V22.917L18.1641 13.5889H20.7422ZM12.1172 14.5264L12.3984 16.167L3.39844 22.917H0.867188L12.1172 14.5264ZM30.8672 0.416992V0.557617L19.1953 9.37012L19.2891 7.30762L28.5234 0.416992H30.8672ZM0.867188 0.416992L12.0703 8.66699H9.25781L0.867188 2.38574V0.416992Z" fill="#C8102E"/>
              <path d="M12.1641 0.416992V22.917H19.6641V0.416992H12.1641ZM0.867188 7.91699V15.417H30.8672V7.91699H0.867188Z" fill="white"/>
              <path d="M0.867188 9.46387V13.9639H30.8672V9.46387H0.867188ZM13.6641 0.416992V22.917H18.1641V0.416992H13.6641Z" fill="#C8102E"/>
              </g>
              <defs>
              <clipPath id="clip0_1941_9591">
              <rect x="0.867188" y="0.416992" width="30" height="22.5" rx="1" fill="white"/>
              </clipPath>
              </defs>
            </svg>
            <span className='font-medium'>United Kingdom</span>
          </li>
          <li className="flex items-center gap-3 mb-3 border border-[#efefef] p-2 rounded-sm">
            <svg width="31" height="23" viewBox="0 0 31 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1941_9591)">
              <path d="M0.867188 0.416992H30.8672V22.917H0.867188V0.416992Z" fill="#012169"/>
              <path d="M4.38281 0.416992L15.8203 8.90137L27.2109 0.416992H30.8672V3.32324L19.6172 11.7139L30.8672 20.0576V22.917H27.1172L15.8672 14.5264L4.66406 22.917H0.867188V20.1045L12.0703 11.7607L0.867188 3.41699V0.416992H4.38281Z" fill="white"/>
              <path d="M20.7422 13.5889L30.8672 21.042V22.917L18.1641 13.5889H20.7422ZM12.1172 14.5264L12.3984 16.167L3.39844 22.917H0.867188L12.1172 14.5264ZM30.8672 0.416992V0.557617L19.1953 9.37012L19.2891 7.30762L28.5234 0.416992H30.8672ZM0.867188 0.416992L12.0703 8.66699H9.25781L0.867188 2.38574V0.416992Z" fill="#C8102E"/>
              <path d="M12.1641 0.416992V22.917H19.6641V0.416992H12.1641ZM0.867188 7.91699V15.417H30.8672V7.91699H0.867188Z" fill="white"/>
              <path d="M0.867188 9.46387V13.9639H30.8672V9.46387H0.867188ZM13.6641 0.416992V22.917H18.1641V0.416992H13.6641Z" fill="#C8102E"/>
              </g>
              <defs>
              <clipPath id="clip0_1941_9591">
              <rect x="0.867188" y="0.416992" width="30" height="22.5" rx="1" fill="white"/>
              </clipPath>
              </defs>
            </svg>
            <span className='font-medium'>United Kingdom</span>
          </li>
          <li className="flex items-center gap-3 mb-3 border border-[#efefef] p-2 rounded-sm">
            <svg width="31" height="23" viewBox="0 0 31 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1941_9591)">
              <path d="M0.867188 0.416992H30.8672V22.917H0.867188V0.416992Z" fill="#012169"/>
              <path d="M4.38281 0.416992L15.8203 8.90137L27.2109 0.416992H30.8672V3.32324L19.6172 11.7139L30.8672 20.0576V22.917H27.1172L15.8672 14.5264L4.66406 22.917H0.867188V20.1045L12.0703 11.7607L0.867188 3.41699V0.416992H4.38281Z" fill="white"/>
              <path d="M20.7422 13.5889L30.8672 21.042V22.917L18.1641 13.5889H20.7422ZM12.1172 14.5264L12.3984 16.167L3.39844 22.917H0.867188L12.1172 14.5264ZM30.8672 0.416992V0.557617L19.1953 9.37012L19.2891 7.30762L28.5234 0.416992H30.8672ZM0.867188 0.416992L12.0703 8.66699H9.25781L0.867188 2.38574V0.416992Z" fill="#C8102E"/>
              <path d="M12.1641 0.416992V22.917H19.6641V0.416992H12.1641ZM0.867188 7.91699V15.417H30.8672V7.91699H0.867188Z" fill="white"/>
              <path d="M0.867188 9.46387V13.9639H30.8672V9.46387H0.867188ZM13.6641 0.416992V22.917H18.1641V0.416992H13.6641Z" fill="#C8102E"/>
              </g>
              <defs>
              <clipPath id="clip0_1941_9591">
              <rect x="0.867188" y="0.416992" width="30" height="22.5" rx="1" fill="white"/>
              </clipPath>
              </defs>
            </svg>
            <span className='font-medium'>United Kingdom</span>
          </li>
        </ul>
      </div>
    </Modal>
  )
}