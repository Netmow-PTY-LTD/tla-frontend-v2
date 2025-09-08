'use client';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/UIComponents/Modal';
import { useAllServicesQuery } from '@/store/features/admin/servicesApiService';
import { useAddLeadServiceMutation } from '@/store/features/leadService/leadServiceApiService';
import { Loader, X } from 'lucide-react';
import React, { useState } from 'react';
import DistanceMap from '../../profile/_components/DistanceMap';

const AddLocationModal = ({ open, setOpen }) => {
  return (
    <div>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Add location"
        // buttonName="+ Add location"
        className="w-full " // ensure modal is full width (adjust max-width as needed)
        width="max-w-[600px]"
      >
        <DistanceMap />
      </Modal>
    </div>
  );
};

export default AddLocationModal;
