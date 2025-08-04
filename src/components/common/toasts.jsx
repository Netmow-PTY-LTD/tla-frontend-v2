import { toast } from 'sonner';

// Success Toast
export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 2000,
    position: 'top-right',
    style: { backgroundColor: '#22bb33', color: 'white' },
  });
};

// Error Toast
export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: { backgroundColor: '#bb2124', color: 'white' },
  });
};

// Info Toast
export const showInfoToast = (message) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      backgroundColor: '#5bc0de',
      color: 'white',
    },
  });
};

// Warning Toast
export const showWarningToast = (message) => {
  toast(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      backgroundColor: '#f0ad4e',
      color: 'white',
    },
  });
};
