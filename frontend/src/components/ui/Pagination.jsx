import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";


/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
|
| Production-ready reusable pagination component.
|
| Features:
| - Previous / next navigation
| - Page numbers
| - Ellipsis for large page ranges
| - Results summary
| - Disabled states
| - Responsive UI
| - Accessible navigation
|
|--------------------------------------------------------------------------
*/


const Pagination = ({
    page = 1,

    totalPages = 0,

    total = 0,

    limit = 20,

    onPageChange,

    disabled = false,

    className = "",
}) => {


    /*
    |--------------------------------------------------------------------------
    | Nothing to paginate
    |--------------------------------------------------------------------------
    */

    if (
        totalPages <= 1 &&
        total <= limit
    ) {
        return null;
    }


    /*
    |--------------------------------------------------------------------------
    | Normalize Values
    |--------------------------------------------------------------------------
    */

    const currentPage = Math.min(
        Math.max(Number(page) || 1, 1),
        Math.max(Number(totalPages) || 1, 1)
    );

    const normalizedTotalPages =
        Math.max(
            Number(totalPages) || 1,
            1
        );

    const normalizedTotal =
        Math.max(
            Number(total) || 0,
            0
        );

    const normalizedLimit =
        Math.max(
            Number(limit) || 1,
            1
        );


    /*
    |--------------------------------------------------------------------------
    | Result Range
    |--------------------------------------------------------------------------
    */

    const start =
        normalizedTotal === 0
            ? 0
            : (currentPage - 1) *
                  normalizedLimit +
              1;

    const end = Math.min(
        currentPage * normalizedLimit,
        normalizedTotal
    );


    /*
    |--------------------------------------------------------------------------
    | Generate Page Items
    |--------------------------------------------------------------------------
    */

    const getPageItems = () => {

        if (normalizedTotalPages <= 7) {

            return Array.from(
                {
                    length:
                        normalizedTotalPages,
                },
                (_, index) =>
                    index + 1
            );
        }


        const items = [];


        /*
        |--------------------------------------------------------------
        | Always show first page
        |--------------------------------------------------------------
        */

        items.push(1);


        /*
        |--------------------------------------------------------------
        | Left ellipsis
        |--------------------------------------------------------------
        */

        if (currentPage > 4) {
            items.push("left-ellipsis");
        }


        /*
        |--------------------------------------------------------------
        | Middle pages
        |--------------------------------------------------------------
        */

        const middleStart =
            Math.max(
                2,
                currentPage - 1
            );

        const middleEnd =
            Math.min(
                normalizedTotalPages - 1,
                currentPage + 1
            );


        for (
            let pageNumber = middleStart;
            pageNumber <= middleEnd;
            pageNumber += 1
        ) {
            items.push(pageNumber);
        }


        /*
        |--------------------------------------------------------------
        | Right ellipsis
        |--------------------------------------------------------------
        */

        if (
            currentPage <
            normalizedTotalPages - 3
        ) {
            items.push("right-ellipsis");
        }


        /*
        |--------------------------------------------------------------
        | Always show last page
        |--------------------------------------------------------------
        */

        items.push(
            normalizedTotalPages
        );


        return items;
    };


    const pageItems = getPageItems();


    /*
    |--------------------------------------------------------------------------
    | Change Page
    |--------------------------------------------------------------------------
    */

    const changePage = (
        nextPage
    ) => {

        if (disabled) {
            return;
        }

        if (
            nextPage < 1 ||
            nextPage > normalizedTotalPages ||
            nextPage === currentPage
        ) {
            return;
        }

        onPageChange?.(nextPage);
    };


    /*
    |--------------------------------------------------------------------------
    | Button Base Classes
    |--------------------------------------------------------------------------
    */

    const buttonBase = `
        inline-flex
        h-9
        min-w-9
        items-center
        justify-center
        rounded-lg
        border
        text-sm
        font-medium
        transition
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-1
        disabled:pointer-events-none
        disabled:opacity-50
    `;


    return (
        <div
            className={`
                flex
                flex-col
                gap-4
                border-t
                border-slate-200
                px-4
                py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-5
                ${className}
            `}
        >

            {/* =========================================================
                Results Summary
            ========================================================= */}

            <p
                className="
                    text-center
                    text-xs
                    text-slate-500
                    sm:text-left
                "
            >
                Showing{" "}
                <span className="font-semibold text-slate-700">
                    {start}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-700">
                    {end}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                    {normalizedTotal}
                </span>{" "}
                results
            </p>


            {/* =========================================================
                Controls
            ========================================================= */}

            <nav
                aria-label="Pagination"
                className="
                    flex
                    items-center
                    justify-center
                    gap-1
                "
            >

                {/* Previous */}

                <button
                    type="button"
                    onClick={() =>
                        changePage(
                            currentPage - 1
                        )
                    }
                    disabled={
                        disabled ||
                        currentPage === 1
                    }
                    aria-label="Previous page"
                    className={`
                        ${buttonBase}
                        border-slate-200
                        bg-white
                        px-2
                        text-slate-600
                        hover:bg-slate-50
                        hover:text-slate-900
                    `}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>


                {/* Page Numbers */}

                <div className="hidden items-center gap-1 sm:flex">

                    {pageItems.map(
                        (item) => {

                            if (
                                typeof item ===
                                "string"
                            ) {
                                return (
                                    <span
                                        key={item}
                                        className="
                                            flex
                                            h-9
                                            min-w-9
                                            items-center
                                            justify-center
                                            px-1
                                            text-sm
                                            text-slate-400
                                        "
                                        aria-hidden="true"
                                    >
                                        …
                                    </span>
                                );
                            }


                            const isActive =
                                item ===
                                currentPage;


                            return (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() =>
                                        changePage(
                                            item
                                        )
                                    }
                                    disabled={
                                        disabled
                                    }
                                    aria-current={
                                        isActive
                                            ? "page"
                                            : undefined
                                    }
                                    className={`
                                        ${buttonBase}
                                        ${
                                            isActive
                                                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }
                                    `}
                                >
                                    {item}
                                </button>
                            );
                        }
                    )}

                </div>


                {/* Mobile Page Indicator */}

                <span
                    className="
                        px-3
                        text-xs
                        font-medium
                        text-slate-500
                        sm:hidden
                    "
                >
                    Page{" "}
                    <span className="text-slate-900">
                        {currentPage}
                    </span>
                    {" "}of{" "}
                    <span className="text-slate-900">
                        {normalizedTotalPages}
                    </span>
                </span>


                {/* Next */}

                <button
                    type="button"
                    onClick={() =>
                        changePage(
                            currentPage + 1
                        )
                    }
                    disabled={
                        disabled ||
                        currentPage ===
                            normalizedTotalPages
                    }
                    aria-label="Next page"
                    className={`
                        ${buttonBase}
                        border-slate-200
                        bg-white
                        px-2
                        text-slate-600
                        hover:bg-slate-50
                        hover:text-slate-900
                    `}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>

            </nav>

        </div>
    );
};


export default Pagination;