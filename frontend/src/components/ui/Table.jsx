/*
|--------------------------------------------------------------------------
| Table
|--------------------------------------------------------------------------
|
| Production-ready reusable data table.
|
| Features:
| - Responsive horizontal scrolling
| - Semantic table markup
| - Loading state
| - Empty state
| - Custom columns
| - Row click support
| - Custom row rendering
| - Accessible labels
| - Optional striped rows
| - Optional hover behavior
|
|--------------------------------------------------------------------------
*/

const Table = ({
    columns = [],

    data = [],

    rowKey = "_id",

    loading = false,

    emptyMessage = "No records found.",

    emptyDescription,

    onRowClick,

    striped = false,

    hoverable = true,

    compact = false,

    className = "",

    tableClassName = "",

    renderRow,
}) => {


    /*
    |--------------------------------------------------------------------------
    | Resolve Row Key
    |--------------------------------------------------------------------------
    */

    const getRowKey = (
        row,
        index
    ) => {

        if (
            typeof rowKey === "function"
        ) {
            return rowKey(
                row,
                index
            );
        }

        return (
            row?.[rowKey] ??
            index
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Render Loading Rows
    |--------------------------------------------------------------------------
    */

    const loadingRows = Array.from(
        { length: 6 },
        (_, index) => index
    );


    return (
        <div
            className={`
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                ${className}
            `}
        >

            {/* =========================================================
                Responsive Table Container
            ========================================================= */}

            <div
                className="
                    w-full
                    overflow-x-auto
                "
            >

                <table
                    className={`
                        w-full
                        min-w-[760px]
                        border-collapse
                        text-left
                        ${tableClassName}
                    `}
                >

                    {/* =================================================
                        Header
                    ================================================= */}

                    <thead>
                        <tr
                            className="
                                border-b
                                border-slate-200
                                bg-slate-50/80
                            "
                        >

                            {columns.map(
                                (
                                    column,
                                    index
                                ) => (
                                    <th
                                        key={
                                            column.key ??
                                            column.id ??
                                            index
                                        }
                                        scope="col"
                                        className={`
                                            whitespace-nowrap
                                            px-4
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                            ${
                                                compact
                                                    ? "py-2.5 text-[10px]"
                                                    : "py-3.5 text-[11px]"
                                            }
                                            ${
                                                column.headerClassName ||
                                                ""
                                            }
                                        `}
                                        style={{
                                            width:
                                                column.width,
                                            minWidth:
                                                column.minWidth,
                                        }}
                                    >
                                        {column.header}
                                    </th>
                                )
                            )}

                        </tr>
                    </thead>


                    {/* =================================================
                        Body
                    ================================================= */}

                    <tbody
                        className="
                            divide-y
                            divide-slate-100
                        "
                    >

                        {/* =============================================
                            Loading
                        ============================================= */}

                        {loading &&
                            loadingRows.map(
                                (rowIndex) => (
                                    <tr
                                        key={
                                            `loading-${rowIndex}`
                                        }
                                    >

                                        {columns.map(
                                            (
                                                column,
                                                columnIndex
                                            ) => (
                                                <td
                                                    key={
                                                        column.key ??
                                                        column.id ??
                                                        columnIndex
                                                    }
                                                    className={`
                                                        px-4
                                                        ${
                                                            compact
                                                                ? "py-3"
                                                                : "py-4"
                                                        }
                                                    `}
                                                >
                                                    <div
                                                        className="
                                                            h-4
                                                            w-full
                                                            max-w-[180px]
                                                            animate-pulse
                                                            rounded-md
                                                            bg-slate-100
                                                        "
                                                    />
                                                </td>
                                            )
                                        )}

                                    </tr>
                                )
                            )}


                        {/* =============================================
                            Empty
                        ============================================= */}

                        {!loading &&
                            data.length === 0 && (
                                <tr>

                                    <td
                                        colSpan={
                                            Math.max(
                                                columns.length,
                                                1
                                            )
                                        }
                                    >

                                        <div
                                            className="
                                                flex
                                                min-h-48
                                                flex-col
                                                items-center
                                                justify-center
                                                px-6
                                                py-10
                                                text-center
                                            "
                                        >

                                            <p
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-slate-800
                                                "
                                            >
                                                {emptyMessage}
                                            </p>

                                            {emptyDescription && (
                                                <p
                                                    className="
                                                        mt-1
                                                        max-w-md
                                                        text-sm
                                                        leading-5
                                                        text-slate-500
                                                    "
                                                >
                                                    {
                                                        emptyDescription
                                                    }
                                                </p>
                                            )}

                                        </div>

                                    </td>

                                </tr>
                            )}


                        {/* =============================================
                            Data Rows
                        ============================================= */}

                        {!loading &&
                            data.length > 0 &&
                            data.map(
                                (
                                    row,
                                    rowIndex
                                ) => {

                                    /*
                                    |--------------------------------------------------
                                    | Custom Row
                                    |--------------------------------------------------
                                    */

                                    if (
                                        renderRow
                                    ) {
                                        return renderRow(
                                            row,
                                            rowIndex
                                        );
                                    }


                                    const clickable =
                                        typeof onRowClick ===
                                        "function";


                                    return (
                                        <tr
                                            key={
                                                getRowKey(
                                                    row,
                                                    rowIndex
                                                )
                                            }
                                            onClick={
                                                clickable
                                                    ? () =>
                                                          onRowClick(
                                                              row,
                                                              rowIndex
                                                          )
                                                    : undefined
                                            }
                                            className={`
                                                transition-colors
                                                ${
                                                    striped &&
                                                    rowIndex %
                                                        2 ===
                                                        1
                                                        ? "bg-slate-50/50"
                                                        : "bg-white"
                                                }
                                                ${
                                                    hoverable
                                                        ? "hover:bg-slate-50"
                                                        : ""
                                                }
                                                ${
                                                    clickable
                                                        ? "cursor-pointer"
                                                        : ""
                                                }
                                            `}
                                        >

                                            {columns.map(
                                                (
                                                    column,
                                                    columnIndex
                                                ) => {

                                                    const value =
                                                        column.accessor
                                                            ? column.accessor(
                                                                  row,
                                                                  rowIndex
                                                              )
                                                            : column.key
                                                              ? row?.[
                                                                    column.key
                                                                ]
                                                              : undefined;


                                                    const content =
                                                        column.render
                                                            ? column.render(
                                                                  value,
                                                                  row,
                                                                  rowIndex
                                                              )
                                                            : value;


                                                    return (
                                                        <td
                                                            key={
                                                                column.key ??
                                                                column.id ??
                                                                columnIndex
                                                            }
                                                            className={`
                                                                align-middle
                                                                px-4
                                                                text-sm
                                                                text-slate-700
                                                                ${
                                                                    compact
                                                                        ? "py-3"
                                                                        : "py-4"
                                                                }
                                                                ${
                                                                    column.cellClassName ||
                                                                    ""
                                                                }
                                                            `}
                                                        >
                                                            {content}
                                                        </td>
                                                    );
                                                }
                                            )}

                                        </tr>
                                    );
                                }
                            )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};


export default Table;