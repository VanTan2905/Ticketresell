import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm();
    }
  };

  // Update the onCheckedChange function to accept CheckedState
  const handleCheckedChange = (checked: any) => {
    // Update the state based on the checked value
    setIsChecked(checked === true); // Only set to true if checked is exactly true
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Confirm Send
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2">
            Are you sure you want to send? You can only send one message until
            the staff replies.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center space-x-2 p-2">
          <Checkbox
            id="terms"
            checked={isChecked}
            onCheckedChange={handleCheckedChange} // Use the updated handler
          />
          <Label htmlFor="terms">Tôi đã hiểu</Label>
        </div>
        <div className="flex justify-end items-center">
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 ">
              Cancel
            </AlertDialogCancel>
            <div className="">
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={!isChecked}
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              Confirm
            </AlertDialogAction>
            </div>
           
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
