import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function Modal({
  buttonName = '',
  title = 'modal title',
  description,
  children,
  open,
  onOpenChange,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {buttonName && (
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-[#12C7C4CC] hover:bg-teal-300 px-4 py-3 text-sm rounded-lg text-white mt-5 "
            >
              {buttonName}
            </Button>
          </DialogTrigger>
        )}
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>{title} </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
