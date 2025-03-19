import { toast } from 'sonner';

// Success Toast
export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: { backgroundColor: 'green', color: 'white' },
  });
};

// Error Toast
export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: { backgroundColor: 'red', color: 'white' },
  });
};

// Info Toast
export const showInfoToast = (message) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      backgroundColor: 'blue',
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
      backgroundColor: 'yellow',
      color: 'white',
    },
  });
};
