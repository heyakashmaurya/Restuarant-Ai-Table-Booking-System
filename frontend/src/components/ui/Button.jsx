import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

/*
|--------------------------------------------------------------------------
| Button
|--------------------------------------------------------------------------
|
| Production-ready reusable button component.
|
| Supports:
| - Variants
| - Sizes
| - Loading state
| - Disabled state
| - Icons
| - Full width
| - Native button attributes
| - Forwarded refs
|
|--------------------------------------------------------------------------
*/

const variants = {
    primary: `
        bg-blue-600
        text-white
        shadow-sm
        hover:bg-blue-700
        focus-visible:ring-blue-500
    `,

    secondary: `
        border
        border-slate-200
        bg-white
        text-slate-700
        shadow-sm
        hover:bg-slate-50
        hover:text-slate-900
        focus-visible:ring-slate-400
    `,

    danger: `
        bg-red-600
        text-white
        shadow-sm
        hover:bg-red-700
        focus-visible:ring-red-500
    `,

    ghost: `
        bg-transparent
        text-slate-600
        hover:bg-slate-100
        hover:text-slate-900
        focus-visible:ring-slate-400
    `,

    outlineDanger: `
        border
        border-red-200
        bg-white
        text-red-600
        hover:bg-red-50
        hover:text-red-700
        focus-visible:ring-red-400
    `,

    success: `
        bg-emerald-600
        text-white
        shadow-sm
        hover:bg-emerald-700
        focus-visible:ring-emerald-500
    `,
};


const sizes = {
    xs: `
        h-8
        px-3
        text-xs
        rounded-lg
    `,

    sm: `
        h-9
        px-3.5
        text-sm
        rounded-lg
    `,

    md: `
        h-10
        px-4
        text-sm
        rounded-xl
    `,

    lg: `
        h-11
        px-5
        text-sm
        rounded-xl
    `,

    xl: `
        h-12
        px-6
        text-base
        rounded-xl
    `,
};


const Button = forwardRef(
    (
        {
            children,

            variant = "primary",

            size = "md",

            type = "button",

            loading = false,

            disabled = false,

            fullWidth = false,

            leftIcon = null,

            rightIcon = null,

            className = "",

            loadingText = "Loading...",

            ...props
        },
        ref
    ) => {

        const isDisabled =
            disabled || loading;


        return (
            <button
                ref={ref}

                type={type}

                disabled={isDisabled}

                aria-disabled={isDisabled}

                aria-busy={loading || undefined}

                className={`
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    whitespace-nowrap
                    font-medium
                    outline-none
                    transition-all
                    duration-200

                    focus-visible:ring-2
                    focus-visible:ring-offset-2

                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    ${variants[variant] || variants.primary}

                    ${sizes[size] || sizes.md}

                    ${fullWidth ? "w-full" : ""}

                    ${className}
                `}
                {...props}
            >

                {loading ? (
                    <>
                        <Loader2
                            className="
                                h-4
                                w-4
                                shrink-0
                                animate-spin
                            "
                            aria-hidden="true"
                        />

                        <span>
                            {loadingText}
                        </span>
                    </>
                ) : (
                    <>
                        {leftIcon && (
                            <span
                                className="
                                    flex
                                    shrink-0
                                    items-center
                                    justify-center
                                "
                                aria-hidden="true"
                            >
                                {leftIcon}
                            </span>
                        )}

                        {children}

                        {rightIcon && (
                            <span
                                className="
                                    flex
                                    shrink-0
                                    items-center
                                    justify-center
                                "
                                aria-hidden="true"
                            >
                                {rightIcon}
                            </span>
                        )}
                    </>
                )}

            </button>
        );
    }
);


Button.displayName = "Button";


export default Button;