import {
    Bell,
    ChevronDown,
    Search,
} from "lucide-react";

const Navbar = () => {
    return (
        <div className="flex h-16 items-center justify-between">

            {/* =========================================================
                Search
            ========================================================= */}

            <div className="relative w-full max-w-md">

                <Search
                    className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-slate-400
                    "
                />

                <input
                    type="search"
                    placeholder="Search bookings, customers..."
                    aria-label="Search"
                    className="
                        h-10
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        pl-10
                        pr-4
                        text-sm
                        text-slate-900
                        outline-none
                        placeholder:text-slate-400
                        transition
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-2
                        focus:ring-blue-100
                    "
                />

            </div>

            {/* =========================================================
                Right Side
            ========================================================= */}

            <div className="ml-6 flex items-center gap-3">

                {/* Notifications */}

                <button
                    type="button"
                    aria-label="Notifications"
                    className="
                        relative
                        rounded-xl
                        p-2.5
                        text-slate-500
                        transition
                        hover:bg-slate-100
                        hover:text-slate-900
                    "
                >
                    <Bell className="h-5 w-5" />

                    <span
                        className="
                            absolute
                            right-2
                            top-2
                            h-2
                            w-2
                            rounded-full
                            bg-red-500
                            ring-2
                            ring-white
                        "
                    />
                </button>

                <div className="h-7 w-px bg-slate-200" />

                {/* User */}

                <button
                    type="button"
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        px-2
                        py-1.5
                        transition
                        hover:bg-slate-50
                    "
                >

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        A
                    </div>

                    <div className="hidden text-left xl:block">

                        <p className="text-sm font-semibold text-slate-900">
                            Administrator
                        </p>

                        <p className="text-xs text-slate-500">
                            Manager
                        </p>

                    </div>

                    <ChevronDown className="hidden h-4 w-4 text-slate-400 xl:block" />

                </button>

            </div>

        </div>
    );
};

export default Navbar;