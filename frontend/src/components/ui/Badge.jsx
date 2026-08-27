/*
|--------------------------------------------------------------------------
| Badge
|--------------------------------------------------------------------------
|
| Production-ready reusable status badge.
|
| Designed for:
| - Booking status
| - Payment status
| - Booking source
| - Table status
| - Generic labels
|
|--------------------------------------------------------------------------
*/

const variants = {
    default: `
        border-slate-200
        bg-slate-100
        text-slate-700
    `,

    pending: `
        border-amber-200
        bg-amber-50
        text-amber-700
    `,

    confirmed: `
        border-blue-200
        bg-blue-50
        text-blue-700
    `,

    seated: `
        border-violet-200
        bg-violet-50
        text-violet-700
    `,

    completed: `
        border-emerald-200
        bg-emerald-50
        text-emerald-700
    `,

    cancelled: `
        border-red-200
        bg-red-50
        text-red-700
    `,

    no_show: `
        border-slate-200
        bg-slate-100
        text-slate-600
    `,

    paid: `
        border-emerald-200
        bg-emerald-50
        text-emerald-700
    `,

    refunded: `
        border-orange-200
        bg-orange-50
        text-orange-700
    `,

    not_required: `
        border-slate-200
        bg-slate-100
        text-slate-600
    `,

    available: `
        border-emerald-200
        bg-emerald-50
        text-emerald-700
    `,

    occupied: `
        border-red-200
        bg-red-50
        text-red-700
    `,

    maintenance: `
        border-orange-200
        bg-orange-50
        text-orange-700
    `,

    ai_voice: `
        border-purple-200
        bg-purple-50
        text-purple-700
    `,

    dashboard: `
        border-blue-200
        bg-blue-50
        text-blue-700
    `,

    walk_in: `
        border-cyan-200
        bg-cyan-50
        text-cyan-700
    `,

    website: `
        border-indigo-200
        bg-indigo-50
        text-indigo-700
    `,

    whatsapp: `
        border-green-200
        bg-green-50
        text-green-700
    `,
};


const sizes = {
    sm: `
        px-2
        py-0.5
        text-[11px]
    `,

    md: `
        px-2.5
        py-1
        text-xs
    `,

    lg: `
        px-3
        py-1.5
        text-sm
    `,
};


/*
|--------------------------------------------------------------------------
| Human-readable Labels
|--------------------------------------------------------------------------
*/

const defaultLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    seated: "Seated",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No Show",

    paid: "Paid",
    refunded: "Refunded",
    not_required: "Not Required",

    available: "Available",
    occupied: "Occupied",
    maintenance: "Maintenance",

    ai_voice: "AI Voice",
    dashboard: "Dashboard",
    walk_in: "Walk In",
    website: "Website",
    whatsapp: "WhatsApp",
};


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatLabel = (value) => {
    if (!value) {
        return "";
    }

    if (defaultLabels[value]) {
        return defaultLabels[value];
    }

    return String(value)
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (character) =>
            character.toUpperCase()
        );
};


/*
|--------------------------------------------------------------------------
| Badge Component
|--------------------------------------------------------------------------
*/

const Badge = ({
    children,
    variant = "default",
    size = "md",
    dot = false,
    label,
    className = "",
    ...props
}) => {

    const content =
        label !== undefined
            ? label
            : children;

    const normalizedVariant =
        String(variant)
            .toLowerCase()
            .replace(/\s+/g, "_");

    const variantClass =
        variants[normalizedVariant] ||
        variants.default;

    const displayLabel =
        typeof content === "string"
            ? formatLabel(content)
            : content;


    return (
        <span
            className={`
                inline-flex
                max-w-full
                items-center
                gap-1.5
                rounded-full
                border
                font-medium
                leading-none
                whitespace-nowrap

                ${sizes[size] || sizes.md}

                ${variantClass}

                ${className}
            `}
            {...props}
        >

            {dot && (
                <span
                    className="
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-current
                    "
                    aria-hidden="true"
                />
            )}

            <span className="truncate">
                {displayLabel}
            </span>

        </span>
    );
};


export default Badge;