import {
    forwardRef,
    useId,
} from "react";

import {
    AlertCircle,
} from "lucide-react";


/*
|--------------------------------------------------------------------------
| Input
|--------------------------------------------------------------------------
|
| Production-ready reusable form input.
|
| Supports:
| - Label
| - Required indicator
| - Help text
| - Error state
| - Left icon
| - Right content
| - Full native input attributes
| - Forwarded refs
| - Accessible label / error relationships
|
|--------------------------------------------------------------------------
*/


const Input = forwardRef(
    (
        {
            id,

            name,

            label,

            required = false,

            error = "",

            helpText = "",

            leftIcon = null,

            rightContent = null,

            className = "",

            containerClassName = "",

            labelClassName = "",

            inputClassName = "",

            ...props
        },
        ref
    ) => {

        const generatedId = useId();

        const inputId =
            id ||
            name ||
            `input-${generatedId}`;

        const errorId =
            `${inputId}-error`;

        const helpId =
            `${inputId}-help`;

        const hasError =
            Boolean(error);


        /*
        |--------------------------------------------------------------------------
        | Described By
        |--------------------------------------------------------------------------
        */

        const describedBy = [
            hasError ? errorId : null,
            !hasError && helpText
                ? helpId
                : null,
        ]
            .filter(Boolean)
            .join(" ") || undefined;


        /*
        |--------------------------------------------------------------------------
        | Input Padding
        |--------------------------------------------------------------------------
        */

        const leftPadding =
            leftIcon
                ? "pl-10"
                : "pl-3.5";

        const rightPadding =
            rightContent
                ? "pr-10"
                : "pr-3.5";


        return (
            <div
                className={`
                    w-full
                    ${containerClassName}
                `}
            >

                {/* =====================================================
                    Label
                ===================================================== */}

                {label && (
                    <label
                        htmlFor={inputId}
                        className={`
                            mb-1.5
                            block
                            text-sm
                            font-medium
                            text-slate-700
                            ${labelClassName}
                        `}
                    >
                        {label}

                        {required && (
                            <span
                                className="ml-1 text-red-500"
                                aria-hidden="true"
                            >
                                *
                            </span>
                        )}
                    </label>
                )}


                {/* =====================================================
                    Input Wrapper
                ===================================================== */}

                <div className="relative">

                    {/* Left Icon */}

                    {leftIcon && (
                        <span
                            className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                flex
                                -translate-y-1/2
                                items-center
                                justify-center
                                text-slate-400
                            "
                            aria-hidden="true"
                        >
                            {leftIcon}
                        </span>
                    )}


                    {/* Input */}

                    <input
                        ref={ref}

                        id={inputId}

                        name={name}

                        aria-invalid={
                            hasError
                                ? "true"
                                : undefined
                        }

                        aria-describedby={
                            describedBy
                        }

                        aria-required={
                            required
                                ? "true"
                                : undefined
                        }

                        className={`
                            h-10
                            w-full
                            rounded-xl
                            border
                            bg-white
                            ${leftPadding}
                            ${rightPadding}
                            text-sm
                            text-slate-900
                            outline-none
                            placeholder:text-slate-400
                            transition-all
                            duration-200

                            disabled:cursor-not-allowed
                            disabled:bg-slate-50
                            disabled:text-slate-500

                            ${
                                hasError
                                    ? `
                                        border-red-300
                                        focus:border-red-500
                                        focus:ring-2
                                        focus:ring-red-100
                                    `
                                    : `
                                        border-slate-200
                                        hover:border-slate-300
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    `
                            }

                            ${inputClassName}
                            ${className}
                        `}

                        {...props}
                    />


                    {/* Right Content */}

                    {rightContent && (
                        <div
                            className="
                                absolute
                                right-3
                                top-1/2
                                flex
                                -translate-y-1/2
                                items-center
                                justify-center
                            "
                        >
                            {rightContent}
                        </div>
                    )}

                </div>


                {/* =====================================================
                    Error
                ===================================================== */}

                {hasError && (
                    <p
                        id={errorId}
                        role="alert"
                        className="
                            mt-1.5
                            flex
                            items-start
                            gap-1.5
                            text-xs
                            font-medium
                            text-red-600
                        "
                    >
                        <AlertCircle
                            className="
                                mt-0.5
                                h-3.5
                                w-3.5
                                shrink-0
                            "
                            aria-hidden="true"
                        />

                        <span>
                            {error}
                        </span>
                    </p>
                )}


                {/* =====================================================
                    Help Text
                ===================================================== */}

                {!hasError && helpText && (
                    <p
                        id={helpId}
                        className="
                            mt-1.5
                            text-xs
                            leading-5
                            text-slate-500
                        "
                    >
                        {helpText}
                    </p>
                )}

            </div>
        );
    }
);


Input.displayName = "Input";


export default Input;