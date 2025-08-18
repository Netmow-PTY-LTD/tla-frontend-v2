'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { Arrow } from '@radix-ui/react-dropdown-menu';
import {
  ArrowDown,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Hammer,
  Loader,
  LogOut,
  SearchIcon,
  X,
} from 'lucide-react';
import Gavel from '@/components/icon/Gavel';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { usePathname, useRouter } from 'next/navigation';
import { useGetAllCategoriesQuery } from '@/store/features/public/catagorywiseServiceApiService';
import CreateLeadWithAuthModal from '../../home/modal/CreateLeadWithAuthModal';
import ClientLeadRegistrationModal from '../../home/modal/ClientLeadRegistrationModal';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { useGetServiceWiseQuestionsQuery } from '@/store/features/admin/questionApiService';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';
import { checkValidity } from '@/helpers/validityCheck';

export default function Header() {
  const [isHeaderFixed, setIsHeaderFixed] = useState();
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceWiseQuestions, setServiceWiseQuestions] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const subMenuRef = useRef();

  const dispatch = useDispatch();

  const pathname = usePathname();
  const router = useRouter();

  const token = useSelector((state) => state.auth.token);

  const validToken = checkValidity(token);

  const { data: currentUser } = useAuthUserInfoQuery(undefined, {
    skip: !validToken,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsHeaderFixed(window.scrollY > 50);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const dashboardPaths = {
    admin: '/admin',
    lawyer: '/lawyer/dashboard',
    client: '/client/dashboard',
  };

  const dashboardUrl = dashboardPaths[currentUser?.data?.regUserType] || '';

  const handleOpenSubMenu = (e) => {
    e.preventDefault();
    setShowSubMenu(!showSubMenu);
  };

  const handleModalOpen = () => {
    //setServiceWiseQuestions(null); // Reset serviceWiseQuestions when opening the modal
    setModalOpen(true);
  };

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subMenuRef.current && !subMenuRef.current.contains(event.target)) {
        setShowSubMenu(false);
        setSelectedCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: allCategories } = useGetAllCategoriesQuery();

  const { data: countryList } = useGetCountryListQuery();

  const defaultCountry = countryList?.data?.find(
    (country) => country?.slug === 'au'
  );

  // Default to Australia (AU) if available
  const { data: countryWiseServices, isLoading: isCountryWiseServicesLoading } =
    useGetCountryWiseServicesQuery(defaultCountry?._id, {
      skip: !defaultCountry?._id, // Skip
    });

  //console.log('countryWiseServices', countryWiseServices);

  useEffect(() => {
    if (!selectedService?._id) return;

    // Immediately clear previous questions to prevent flash
    setServiceWiseQuestions([]);
  }, [selectedService?._id]);

  const {
    data: singleServicewiseQuestionsData,
    isLoading: isQuestionsLoading,
    refetch,
  } = useGetServiceWiseQuestionsQuery(
    {
      countryId: defaultCountry?._id,
      serviceId: selectedService?._id,
    },
    {
      skip: !defaultCountry?._id || !selectedService?._id,
    }
  );

  useEffect(() => {
    setServiceWiseQuestions(singleServicewiseQuestionsData?.data || []);
  }, [singleServicewiseQuestionsData]);

  // if (!validToken) {
  //   dispatch(LogOut());
  //   Cookies.remove('token');
  // }

  const filteredServices = countryWiseServices?.data?.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header
      className={`${styles.main_header} ${isHeaderFixed ? styles.sticky : ''}`}
    >
      <div className="container-lg">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className={styles.logo}>
            <Image
              src={'/assets/img/logo.png'}
              alt="TLA Logo"
              width={166}
              height={40}
            />
          </Link>
          <nav className="relative">
            <ul className="flex items-center gap-6">
              {/* <li>
                <Link
                  href="#"
                  className={styles.nav_link}
                  onClick={handleOpenSubMenu}
                >
                  <span>Explore</span>
                  <ChevronDown
                    className={`w-4 h-4 ${
                      showSubMenu ? 'rotate-180' : ''
                    } transition-all duration-300 ease-in-out`}
                  />
                </Link>
                {showSubMenu && (
                  <div className="submenu flex flex-col" ref={subMenuRef}>
                    <div className="flex justify-end md:hidden pt-2 px-4">
                      <button
                        className="text-gray-500"
                        onClick={() => setShowSubMenu(false)}
                      >
                        <X />
                      </button>
                    </div>
                    <div
                      className={`submenu-content flex-1 ${
                        selectedCategory ? 'show-services' : ''
                      }`}
                    >
                      <div className="submenu-categories">
                        <div className="flex justify-between items-center mb-2 border-b pb-2">
                          <div className="font-semibold">Services</div>
                          <Link
                            href="/services"
                            className="text-[13px] font-semibold underline"
                          >
                            View All
                          </Link>
                        </div>
                        <ul>
                          {allCategories?.data?.map((category, index) => (
                            <li key={index}>
                              <Link
                                href={`#`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedCategory(category);
                                }}
                                className="cursor-pointer flex justify-between items-center font-medium"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={category?.image}
                                    alt={category?.name}
                                    className="w-6 h-6"
                                  />
                                  <span>{category?.name}</span>
                                </div>
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="submenu-services">
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="mb-2 text-md font-semibold text-black hover:underline inline-flex items-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back to categories
                        </button>
                        <ul className="border-t pt-2">
                          {selectedCategory?.services?.map((service, i) => (
                            <li key={i} className="mb-1">
                              <Link
                                href={`#`}
                                className={styles.nav_link}
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent default anchor behavior
                                  setSelectedService(service);
                                  handleModalOpen();
                                }}
                              >
                                {service?.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {token && currentUser ? (
                      <div className="flex items-center justify-center gap-4 p-4">
                        <Link
                          href={dashboardUrl}
                          className={styles.btn_register}
                        >
                          <span>Dashboard</span>
                        </Link>
                      </div>
                    ) : (
                      <p className="text-[#34495E] text-[14px] text-center px-4 md:hidden py-4">
                        Are you a legal professional?{' '}
                        <Link
                          href="/register"
                          className="font-semibold text-sm underline text-[var(--secondary-color)]"
                        >
                          Join as a Lawyer
                        </Link>
                      </p>
                    )}
                  </div>
                )}
              </li> */}

              {/* <li>
                <Link href="/services" className={styles.nav_link}>
                  <span>Find Clients</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="7"
                    viewBox="0 0 11 7"
                    fill="none"
                  >
                    <path
                      d="M1.5 1L5.5 5L9.5 1"
                      stroke="#0B1C2D"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="/services" className={styles.nav_link}>
                  <span>Find Lawyers</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="7"
                    viewBox="0 0 11 7"
                    fill="none"
                  >
                    <path
                      d="M1.5 1L5.5 5L9.5 1"
                      stroke="#0B1C2D"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
              </li> */}

              {/* <li>
                <Link href="/" className={styles.nav_link}>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className={styles.nav_link}>
                  <span>Services</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className={styles.nav_link}>
                  <span>Pricing</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.nav_link}>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.nav_link}>
                  <span>Contact</span>
                </Link>
              </li> */}
            </ul>
          </nav>
          <div className="flex items-center gap-6 ml-auto">
            <div
              className={`relative w-full max-w-xs transition-opacity duration-500 ${
                isHeaderFixed ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              <input
                type="search"
                placeholder="Search a service"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true); // Show dropdown when typing
                }}
                onBlur={() => {
                  // Hide dropdown slightly delayed to allow click
                  setTimeout(() => setShowSuggestions(false), 100);
                }}
                onFocus={() => {
                  if (searchTerm) setShowSuggestions(true);
                }}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none text-[14px]"
              />
              <SearchIcon className="w-5 h-5 text-gray-500 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer" />

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredServices?.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 z-50 max-h-60 overflow-auto">
                  {filteredServices?.slice(0, 10)?.map((service) => (
                    <div
                      key={service?._id}
                      onMouseDown={() => {
                        // onMouseDown prevents input blur from firing first
                        setSelectedService(service);
                        handleModalOpen();
                        setSearchTerm(service.name);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {service?.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {token && currentUser ? (
              <div className="flex items-center gap-4 flex-shrink-0">
                <Link href={dashboardUrl} className={styles.btn_register}>
                  <span>Dashboard</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-shrink-0">
                <Link href="/login" className={styles.nav_link}>
                  <span>Log In</span>
                </Link>
                <Link
                  href="/register"
                  className={`${styles.btn_register} ${styles.btn_register_mobile}`}
                >
                  <div className="icon w-6 h-6 bg-white flex items-center justify-center rounded-full">
                    <Gavel className="w-4 h-4 text-black" />
                  </div>
                  <span>Join as a Lawyer</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {validToken && currentUser ? (
        <CreateLeadWithAuthModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          handleModalOpen={handleModalOpen}
          selectedServiceWiseQuestions={serviceWiseQuestions ?? []}
          countryId={defaultCountry?._id}
          serviceId={selectedService?._id}
          locationId={currentUser?.data?.profile?.zipCode}
        />
      ) : (
        <ClientLeadRegistrationModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          handleModalOpen={handleModalOpen}
          selectedServiceWiseQuestions={serviceWiseQuestions ?? []}
          countryId={defaultCountry?._id}
          serviceId={selectedService?._id}
        />
      )}
    </header>
  );
}
