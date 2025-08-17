'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BookOpenText,
  Camera,
  CloudUpload,
  Loader,
  Loader2,
  Trash2,
  UserRound,
} from 'lucide-react';

import ChangePassword from '../../_components/ChangePassword';
import {
  useAuthUserInfoQuery,
  useUpdateUserDataMutation,
} from '@/store/features/auth/authApiService';
import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useEffect, useState } from 'react';
import AddressCombobox from '../../_components/profile/AddressCombobox';
import ChangeEmail from '../../_components/ChangeEmail';

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const {
    data: currentUser,
    isLoading: isLoadingUserInfo,
    refetch: refetchUserInfo,
  } = useAuthUserInfoQuery();

  const [defaultValues, setDefaultValues] = useState({});

  useEffect(() => {
    if (currentUser?.data) {
      setDefaultValues({
        name: currentUser?.data?.profile?.name || '',
        phone: currentUser?.data?.profile?.phone || '',
        userProfileLogo: currentUser?.data?.profile?.profilePicture || '',
        address: currentUser?.data?.profile?.address || '',
        email: currentUser?.data?.email || '',
      });
    }
  }, [currentUser?.data?.profile]);

  const [updateUserData] = useUpdateUserDataMutation();
  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    const { name, phone, userProfileLogo, address, email } = data;

    const payload = {
      userProfile: {
        name,
        phone,
        address,
        email,
      },
    };

    const formData = new FormData();
    // Append serialized JSON data
    formData.append('data', JSON.stringify(payload));

    if (userProfileLogo instanceof File) {
      formData.append('userProfileLogo', userProfileLogo);
    }

    console.log(JSON.parse(formData.get('data')));

    try {
      const res = await updateUserData(formData).unwrap();
      console.log('res', res);
      if (res?.success === true) {
        showSuccessToast(res?.message || 'Update successful');
        refetchUserInfo();
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto my-8 bg-white border border-gray-300 rounded-lg px-10 py-12">
      <div className=" ">
        <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <BookOpenText className="text-[#00C3C0] w-6 h-6" />{' '}
          <span>My Details</span>
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Keep your details updated so that professionals can get in touch. If
          you no longer require the service, please close the request.
        </p>

        <FormWrapper onSubmit={handleSubmit} defaultValues={defaultValues}>
          <div className="flex flex-wrap gap-10 items-start">
            {/* Avatar + Upload */}
            <div className="flex items-center gap-2 mb-6">
              <AvatarUploader name="userProfileLogo" />
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 gap-4 flex-1 w-full md:w-1/2">
              <TextInput
                name="name"
                label="Name"
                placeholder="Enter Your Name"
              />

              <TextInput
                type="tel"
                name="phone"
                label="Phone"
                placeholder="Enter Your Phone"
              />
              {/* <TextInput
                type="text"
                name="address"
                label="Address"
                placeholder="Enter Your Address"
              /> */}

              <AddressCombobox />
              <div className="flex  items-center gap-5 w-full  ">
                <TextInput
                  type="text"
                  name="email"
                  label="Email Adress"
                  placeholder="Email Address"
                  itemClassName="w-1/2"
                  disabled
                />
                <button
                  type="button"
                  className="text-sm text-[#00C3C0] mt-6 block "
                  onClick={() => setOpenEmail(true)}
                >
                  Change Email
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="text-sm text-[#00C3C0] mt-2 block"
                  >
                    Change Password
                  </button>
                </div>

                <Button
                  type="submit"
                  className="bg-[#00C3C0] hover:bg-[#00b3b0] mt-5 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </FormWrapper>
        <ChangePassword setOpen={setOpen} open={open} />
        {/* <ChangeEmail setOpen={setOpenEmail} open={openEmail} /> */}
      </div>
    </div>
  );
};

export default page;
