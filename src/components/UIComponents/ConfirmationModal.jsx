'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { set } from 'zod';

export function ConfirmationModal({
  title = 'Are you sure?',
  description = 'You want to delete your service?',
  cancelText = 'Cancel',
  confirmText = 'Yes',
  onConfirm,
  trigger,
  open,
  onOpenChange,
  contentClass,
  // handleResponseCreate,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={clsx('max-w-sm rounded-lg p-6', contentClass)}>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            className="text-gray-500 border-gray-300 hover:bg-gray-100"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange?.(false);
              // setTimeout(() => handleResponseCreate(), 2000);
            }}
            className="bg-teal-400 hover:bg-teal-500 text-white"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// use example
{
  /* <ConfirmationModal
onConfirm={handleDelete}
open={isOpen}
onOpenChange={setIsOpen}
trigger={
  <Button variant="destructive">
    <Trash2 className="mr-2 h-4 w-4" />
    Delete Service
  </Button>
}
/> */
}
