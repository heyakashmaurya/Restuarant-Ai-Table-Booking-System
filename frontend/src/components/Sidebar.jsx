import {
    BarChart3,
    CalendarDays,
    LayoutDashboard,
    LogOut,
    PhoneCall,
    Settings,
    Table2,
    UtensilsCrossed,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigationItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Reservations",
        path: "/reservations",
        icon: CalendarDays,
    },
    {
        label: "Tables",
        path: "/tables",
        icon: Table2,
    },
    {
        label: "Analytics",
        path: "/analytics",
        icon: BarChart3,
    },
    {
        label: "Call Logs",
        path: "/calls",
        icon: PhoneCall,
    },
    {
        label: "Settings",
        path: "/settings",
        icon: Settings,
    },
];

const Sidebar = ({ onNavigate }) => {
    return (
        <div className="flex h-full flex-col">

            {/* =========================================================
                Brand
            ========================================================= */}

            <div className="hidden h-20 items-center border-b border-slate-200 px-6 lg:flex">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                        <UtensilsCrossed className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-sm font-bold tracking-tight text-slate-900">
                            Restaurant AI
                        </p>

                        <p className="text-xs text-slate-500">
                            Booking System
                        </p>
                    </div>

                </div>

            </div>

            {/* =========================================================
                Navigation
            ========================================================= */}

            <nav
                aria-label="Main navigation"
                className="flex-1 overflow-y-auto px-4 py-6"
            >

                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Main Menu
                </p>

                <div className="space-y-1">

                    {navigationItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onNavigate}
                                className={({ isActive }) =>
                                    `
                                    group
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-2.5
                                    text-sm
                                    font-medium
                                    transition-all

                                    ${
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }
                                    `
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            className={`
                                                h-5 w-5
                                                shrink-0
                                                ${
                                                    isActive
                                                        ? "text-blue-600"
                                                        : "text-slate-400 group-hover:text-slate-600"
                                                }
                                            `}
                                        />

                                        <span>
                                            {item.label}
                                        </span>

                                        {isActive && (
                                            <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}

                </div>

            </nav>

            {/* =========================================================
                Restaurant Status
            ========================================================= */}

            <div className="px-4 pb-4">

                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                    <div className="flex items-center gap-2">

                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        </span>

                        <span className="text-xs font-semibold text-emerald-800">
                            Restaurant Online
                        </span>

                    </div>

                    <p className="mt-1 text-xs leading-5 text-emerald-700">
                        Booking system is operational.
                    </p>

                </div>

            </div>

            {/* =========================================================
                User / Logout
            ========================================================= */}

            <div className="border-t border-slate-200 p-4">

                <div className="flex items-center gap-3 rounded-xl px-2 py-2">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        A
                    </div>

                    <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-slate-900">
                            Administrator
                        </p>

                        <p className="truncate text-xs text-slate-500">
                            Restaurant Manager
                        </p>

                    </div>

                    <button
                        type="button"
                        aria-label="Logout"
                        className="
                            rounded-lg
                            p-2
                            text-slate-400
                            transition
                            hover:bg-red-50
                            hover:text-red-600
                        "
                    >
                        <LogOut className="h-4 w-4" />
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Sidebar;