import { Modal } from '@/components/UIComponents/Modal';
import { logOut } from '@/store/features/auth/authSlice';
import Cookies from 'js-cookie';
import { Info } from 'lucide-react';
import React from 'react';
import { useDispatch } from 'react-redux';

export default function LawyerWarningModal({ modalOpen, setModalOpen }) {
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logOut());
    Cookies.remove('token');
    window.location.reload();
  };
  return (
    <Modal open={modalOpen} onOpenChange={setModalOpen}>
      <div className="text-center text-lg mt-4 text-red-500 flex flex-col items-center gap-2">
        <Info />
        You are not allowed to create a case as you are logged in as a lawyer.
        Please log out to create a case.
      </div>
      <div className="text-center mt-5">
        <button
          className="btn-default bg-[--secondary-color]"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </Modal>
  );
}
