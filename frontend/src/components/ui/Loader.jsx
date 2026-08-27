/*
|--------------------------------------------------------------------------
| Loader
|--------------------------------------------------------------------------
|
| Production-ready reusable loading indicator.
|
| Supports:
| - Inline loading
| - Button/form loading
| - Full container loading
| - Screen loading
| - Multiple sizes
| - Accessible loading state
|
|--------------------------------------------------------------------------
*/

const sizes = {
    xs: "h-3 w-3 border-2",

    sm: "h-4 w-4 border-2",

    md: "h-5 w-5 border-2",

    lg: "h-7 w-7 border-2",

    xl: "h-10 w-10 border-[3px]",
};


const Loader = ({
    size = "md",

    label = "Loading",

    fullScreen = false,

    className = "",

    ...props
}) => {

    const spinner = (
        <span
            role="status"
            aria-label={label}
            className={`
                inline-block
                animate-spin
                rounded-full
                border-slate-200
                border-t-blue-600
                ${sizes[size] || sizes.md}
                ${className}
            `}
            {...props}
        />
    );


    /*
    |--------------------------------------------------------------------------
    | Full Screen Loader
    |--------------------------------------------------------------------------
    */

    if (fullScreen) {
        return (
            <div
                className="
                    fixed
                    inset-0
                    z-[100]
                    flex
                    items-center
                    justify-center
                    bg-white/80
                    backdrop-blur-sm
                "
                role="status"
                aria-label={label}
            >
                <div className="flex flex-col items-center gap-3">

                    {spinner}

                    <span
                        className="
                            text-sm
                            font-medium
                            text-slate-600
                        "
                    >
                        {label}
                    </span>

                </div>
            </div>
        );
    }


    return spinner;
};


export default Loader;