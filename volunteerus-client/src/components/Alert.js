import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function Alert({ message, type }) {
    let classes = "";
    const [hidden, setHidden] = useState(false);
    const handleClose = (event) => {
        event.preventDefault();
        setHidden(true);
    }

    switch (type) {
        case "success":
            classes = "bg-green-50 text-green-800";
            break;
        case "error":
            classes = "bg-red-50 text-red-800";
            break;
        case "warning":
            classes = "bg-yellow-50 text-yellow-800";
            break;
        default:
            classes = "bg-blue-50 text-blue-800";
    }


    return (
        <>
            <div className={`flex justify-between p-4 mb-4 text-sm rounded-lg ${classes} ${classNames(hidden ? "hidden" : "")}`} role="alert">
                {message}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={handleClose}>
                    <XMarkIcon className="h-5 w-5 text-neutral-500" aria-hidden="true" />
                </button>
            </div>
        </>
    );
}

export default Alert;