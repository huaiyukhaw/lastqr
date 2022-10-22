import { Dispatch, Fragment, SetStateAction } from "react";
import { Transition } from "@headlessui/react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import clsx from "clsx";

type AlertDialogComponentProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  action: () => void;
};

const AlertDialogComponent: React.FC<AlertDialogComponentProps> = ({
  open,
  onOpenChange,
  action,
}) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <Transition.Root show={open}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <AlertDialog.Overlay
            forceMount
            className="fixed inset-0 z-20 bg-black/50"
          />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <AlertDialog.Content
            forceMount
            className={clsx(
              "fixed z-50",
              "w-[95vw] max-w-md rounded-lg p-4 md:w-full",
              "top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
              "bg-white dark:bg-gray-800",
              "focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75"
            )}
          >
            <AlertDialog.Title className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Are you absolutely sure?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
              This action cannot be undone. This will permanently delete this
              shop and remove your data from our servers.
            </AlertDialog.Description>
            <div className="mt-4 flex justify-end space-x-2">
              <AlertDialog.Cancel
                className={clsx(
                  "inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium",
                  "bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 hover:dark:bg-gray-600",
                  "border border-gray-300 dark:border-transparent",
                  "focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75"
                )}
              >
                Cancel
              </AlertDialog.Cancel>
              <AlertDialog.Action
                className={clsx(
                  "inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium",
                  "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:text-gray-100 dark:hover:bg-red-600",
                  "border border-transparent",
                  "focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75"
                )}
                onClick={action}
              >
                Confirm Delete
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </Transition.Child>
      </Transition.Root>
    </AlertDialog.Root>
  );
};

export default AlertDialogComponent;
