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
  height = '',
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="z-[999]">
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
      <DialogContent
        className={`${width} ${height} overflow-y-auto w-full z-[9999]`}
      >
        {/* Dialog Header */}
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
