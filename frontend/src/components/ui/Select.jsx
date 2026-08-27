import {
    forwardRef,
    useId,
} from "react";

import {
    AlertCircle,
    ChevronDown,
} from "lucide-react";


/*
|--------------------------------------------------------------------------
| Select
|--------------------------------------------------------------------------
|
| Production-ready reusable select component.
|
| Supports:
| - Label
| - Required indicator
| - Error state
| - Help text
| - Placeholder
| - Native <select> behavior
| - Forwarded refs
| - Accessible descriptions
| - Custom options
| - Disabled state
|
|--------------------------------------------------------------------------
*/


const Select = forwardRef(
    (
        {
            id,

            name,

            label,

            required = false,

            error = "",

            helpText = "",

            placeholder = "Select an option",

            options = [],

            children,

            value,

            defaultValue,

            onChange,

            disabled = false,

            className = "",

            containerClassName = "",

            labelClassName = "",

            selectClassName = "",

            ...props
        },
        ref
    ) => {

        const generatedId = useId();

        const selectId =
            id ||
            name ||
            `select-${generatedId}`;

        const errorId =
            `${selectId}-error`;

        const helpId =
            `${selectId}-help`;

        const hasError =
            Boolean(error);


        /*
        |--------------------------------------------------------------------------
        | Accessibility Description
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
                        htmlFor={selectId}
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
                    Select Wrapper
                ===================================================== */}

                <div className="relative">

                    <select
                        ref={ref}

                        id={selectId}

                        name={name}

                        value={value}

                        defaultValue={defaultValue}

                        onChange={onChange}

                        disabled={disabled}

                        required={required}

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
                            appearance-none
                            rounded-xl
                            border
                            bg-white
                            px-3.5
                            pr-10
                            text-sm
                            text-slate-900
                            outline-none
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

                            ${selectClassName}
                            ${className}
                        `}

                        {...props}
                    >

                        {/* =================================================
                            Placeholder
                        ================================================= */}

                        {placeholder && (
                            <option
                                value=""
                                disabled
                            >
                                {placeholder}
                            </option>
                        )}


                        {/* =================================================
                            Options
                        ================================================= */}

                        {children ||
                            options.map(
                                (option) => (
                                    <option
                                        key={
                                            option.value
                                        }
                                        value={
                                            option.value
                                        }
                                        disabled={
                                            option.disabled ||
                                            false
                                        }
                                    >
                                        {
                                            option.label
                                        }
                                    </option>
                                )
                            )}

                    </select>


                    {/* =================================================
                        Chevron
                    ================================================= */}

                    <ChevronDown
                        className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-slate-400
                        "
                        aria-hidden="true"
                    />

                </div>


                {/* =====================================================
                    Error
                ================================================= */}

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


Select.displayName = "Select";


export default Select;