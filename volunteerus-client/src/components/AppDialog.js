import { Dialog } from "@headlessui/react";

function AppDialog({title, description, warningMessage, actionName, handleAction}) {
    let [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onClose={() => setOpen(false)}>
            <Dialog.Panel>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>
                    { description }
                </Dialog.Description>
                <p>
                    { warningMessage }
                </p>
                <button onClick={() => setIsOpen(false)}>Close</button>
                <button onClick={() => handleAction}>{ actionName }</button>                    
            </Dialog.Panel>
        </Dialog>
    );
}