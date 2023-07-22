import { Dialog } from "@headlessui/react";

function AppDialog({ isOpen, title, description, warningMessage, actionName, handleAction, handleClose }) {
    return (
        <Dialog open={isOpen} onClose={handleClose}>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true"></div>

            {/* Panel */}
            <div className="fixed inset-0 flex items-center justify-center">
                <Dialog.Panel className="mx-auto max-w-md lg:max-w-lg xl:max-w-xl rounded bg-white p-5">
                    <Dialog.Title className="font-semibold text-base lg:text-lg xl:text-xl">{title}</Dialog.Title>
                    <Dialog.Description className="text-neutral-600 mt-2">
                        {description} {warningMessage}
                    </Dialog.Description>
                    <div className="mt-4 flex justify-end">
                        <button
                            className="mr-2 px-4 py-2 rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition duration-150 ease-in-out"
                            onClick={() => handleClose()}
                        >
                            Close
                        </button>
                        <button
                            className="px-4 py-2 rounded bg-danger-600 text-white hover:bg-primary-700 transition duration-150 ease-in-out"
                            onClick={() => handleAction()}
                        >{actionName}</button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

export default AppDialog;