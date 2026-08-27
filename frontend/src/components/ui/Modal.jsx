import {
    useEffect,
    useRef,
} from "react";

import {
    X,
} from "lucide-react";


/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
|
| Production-ready reusable modal.
|
| Supports:
| - Controlled open/close state
| - Escape key
| - Backdrop click
| - Body scroll locking
| - Accessible dialog semantics
| - Header / body / footer
| - Multiple sizes
| - Optional close button
|
|--------------------------------------------------------------------------
*/

const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
};


const Modal = ({
    open = false,

    onClose,

    title,

    description,

    children,

    footer,

    size = "md",

    closeOnBackdrop = true,

    closeOnEscape = true,

    showCloseButton = true,

    className = "",

    contentClassName = "",
}) => {

    const modalRef = useRef(null);

    const previousActiveElement =
        useRef(null);


    /*
    |--------------------------------------------------------------------------
    | Escape + Body Scroll + Focus
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!open) {
            return undefined;
        }


        previousActiveElement.current =
            document.activeElement;


        const handleKeyDown = (event) => {

            if (
                closeOnEscape &&
                event.key === "Escape"
            ) {
                onClose?.();
            }


            /*
            |--------------------------------------------------------------
            | Basic focus containment
            |--------------------------------------------------------------
            */

            if (
                event.key !== "Tab" ||
                !modalRef.current
            ) {
                return;
            }


            const focusableElements =
                modalRef.current.querySelectorAll(
                    [
                        "button:not([disabled])",
                        "a[href]",
                        "input:not([disabled])",
                        "select:not([disabled])",
                        "textarea:not([disabled])",
                        "[tabindex]:not([tabindex='-1'])",
                    ].join(",")
                );


            if (!focusableElements.length) {
                return;
            }


            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                    focusableElements.length - 1
                ];


            if (
                event.shiftKey &&
                document.activeElement ===
                    firstElement
            ) {
                event.preventDefault();

                lastElement.focus();

            } else if (
                !event.shiftKey &&
                document.activeElement ===
                    lastElement
            ) {
                event.preventDefault();

                firstElement.focus();
            }
        };


        document.addEventListener(
            "keydown",
            handleKeyDown
        );


        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";


        requestAnimationFrame(() => {

            const firstFocusable =
                modalRef.current?.querySelector(
                    [
                        "button:not([disabled])",
                        "input:not([disabled])",
                        "select:not([disabled])",
                        "textarea:not([disabled])",
                        "[tabindex]:not([tabindex='-1'])",
                    ].join(",")
                );


            firstFocusable?.focus();
        });


        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow =
                previousOverflow;


            previousActiveElement.current?.focus?.();
        };

    }, [
        open,
        onClose,
        closeOnEscape,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Don't Render When Closed
    |--------------------------------------------------------------------------
    */

    if (!open) {
        return null;
    }


    /*
    |--------------------------------------------------------------------------
    | Backdrop Handler
    |--------------------------------------------------------------------------
    */

    const handleBackdropClick = (
        event
    ) => {

        if (
            closeOnBackdrop &&
            event.target === event.currentTarget
        ) {
            onClose?.();
        }
    };


    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                overflow-y-auto
                p-4
                sm:p-6
            "
            aria-hidden={!open}
        >

            {/* =========================================================
                Backdrop
            ========================================================= */}

            <div
                className="
                    absolute
                    inset-0
                    bg-slate-950/50
                    backdrop-blur-[2px]
                "
                onMouseDown={
                    handleBackdropClick
                }
            />


            {/* =========================================================
                Modal
            ========================================================= */}

            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={
                    title
                        ? "modal-title"
                        : undefined
                }
                aria-describedby={
                    description
                        ? "modal-description"
                        : undefined
                }
                className={`
                    relative
                    z-10
                    flex
                    max-h-[calc(100vh-2rem)]
                    w-full
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                    ${sizes[size] || sizes.md}
                    ${className}
                `}
            >

                {/* =====================================================
                    Header
                ===================================================== */}

                {(title ||
                    description ||
                    showCloseButton) && (

                    <div
                        className="
                            flex
                            shrink-0
                            items-start
                            justify-between
                            gap-4
                            border-b
                            border-slate-100
                            px-5
                            py-4
                            sm:px-6
                        "
                    >

                        <div className="min-w-0">

                            {title && (
                                <h2
                                    id="modal-title"
                                    className="
                                        text-base
                                        font-semibold
                                        tracking-tight
                                        text-slate-900
                                        sm:text-lg
                                    "
                                >
                                    {title}
                                </h2>
                            )}


                            {description && (
                                <p
                                    id="modal-description"
                                    className="
                                        mt-1
                                        text-sm
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    {description}
                                </p>
                            )}

                        </div>


                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close dialog"
                                className="
                                    shrink-0
                                    rounded-lg
                                    p-2
                                    text-slate-400
                                    transition
                                    hover:bg-slate-100
                                    hover:text-slate-700
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:ring-offset-2
                                "
                            >
                                <X
                                    className="
                                        h-5
                                        w-5
                                    "
                                />
                            </button>
                        )}

                    </div>
                )}


                {/* =====================================================
                    Body
                ===================================================== */}

                <div
                    className={`
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-5
                        py-5
                        sm:px-6
                        ${contentClassName}
                    `}
                >
                    {children}
                </div>


                {/* =====================================================
                    Footer
                ===================================================== */}

                {footer && (
                    <div
                        className="
                            flex
                            shrink-0
                            flex-col-reverse
                            gap-2
                            border-t
                            border-slate-100
                            bg-slate-50/70
                            px-5
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-end
                            sm:px-6
                        "
                    >
                        {footer}
                    </div>
                )}

            </div>

        </div>
    );
};


export default Modal;