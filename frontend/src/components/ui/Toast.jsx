import {
    CheckCircle2,
    Info,
    AlertTriangle,
    XCircle,
    X,
} from "lucide-react";


/*
|--------------------------------------------------------------------------
| Toast
|--------------------------------------------------------------------------
|
| Reusable notification UI.
|
| Supported types:
| - success
| - error
| - warning
| - info
|
|--------------------------------------------------------------------------
*/


const toastConfig = {
    success: {
        icon: CheckCircle2,
        wrapper:
            "border-emerald-200 bg-emerald-50",
        iconColor:
            "text-emerald-600",
        titleColor:
            "text-emerald-900",
        messageColor:
            "text-emerald-700",
    },

    error: {
        icon: XCircle,
        wrapper:
            "border-red-200 bg-red-50",
        iconColor:
            "text-red-600",
        titleColor:
            "text-red-900",
        messageColor:
            "text-red-700",
    },

    warning: {
        icon: AlertTriangle,
        wrapper:
            "border-amber-200 bg-amber-50",
        iconColor:
            "text-amber-600",
        titleColor:
            "text-amber-900",
        messageColor:
            "text-amber-700",
    },

    info: {
        icon: Info,
        wrapper:
            "border-blue-200 bg-blue-50",
        iconColor:
            "text-blue-600",
        titleColor:
            "text-blue-900",
        messageColor:
            "text-blue-700",
    },
};


const Toast = ({
    type = "info",

    title,

    message,

    onClose,

    action,

    className = "",
}) => {

    const config =
        toastConfig[type] ||
        toastConfig.info;

    const Icon = config.icon;


    return (
        <div
            role={
                type === "error"
                    ? "alert"
                    : "status"
            }
            aria-live={
                type === "error"
                    ? "assertive"
                    : "polite"
            }
            className={`
                pointer-events-auto
                w-full
                max-w-sm
                overflow-hidden
                rounded-xl
                border
                shadow-lg
                ${config.wrapper}
                ${className}
            `}
        >

            <div className="flex gap-3 p-4">

                {/* =====================================================
                    Icon
                ===================================================== */}

                <Icon
                    className={`
                        mt-0.5
                        h-5
                        w-5
                        shrink-0
                        ${config.iconColor}
                    `}
                    aria-hidden="true"
                />


                {/* =====================================================
                    Content
                ===================================================== */}

                <div className="min-w-0 flex-1">

                    {title && (
                        <p
                            className={`
                                text-sm
                                font-semibold
                                ${config.titleColor}
                            `}
                        >
                            {title}
                        </p>
                    )}


                    {message && (
                        <p
                            className={`
                                mt-0.5
                                text-sm
                                leading-5
                                ${config.messageColor}
                            `}
                        >
                            {message}
                        </p>
                    )}


                    {action && (
                        <div className="mt-3">
                            {action}
                        </div>
                    )}

                </div>


                {/* =====================================================
                    Close
                ===================================================== */}

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Dismiss notification"
                        className={`
                            -mr-1
                            -mt-1
                            shrink-0
                            rounded-lg
                            p-1.5
                            transition
                            hover:bg-black/5
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            ${config.iconColor}
                        `}
                    >
                        <X
                            className="h-4 w-4"
                        />
                    </button>
                )}

            </div>

        </div>
    );
};


export default Toast;