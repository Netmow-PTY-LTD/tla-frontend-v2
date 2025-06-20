import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function Modal({
  buttonName,
  title,
  description,
  children,
  open,
  onOpenChange,
  width = 'max-w-[500px]',
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
      <DialogContent className={`${width}`}>
        <DialogHeader>
          <DialogTitle>
            {title ? title : <VisuallyHidden>Dialog</VisuallyHidden>}
          </DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : (
            <DialogDescription>
              <VisuallyHidden>No additional information</VisuallyHidden>
            </DialogDescription>
          )}
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
