import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
    Bell,
    Menu,
    X,
} from "lucide-react";

import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* =========================================================
                Mobile Sidebar Overlay
            ========================================================= */}

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setSidebarOpen(false)}
                    className="
                        fixed inset-0 z-40
                        bg-slate-950/50
                        backdrop-blur-[2px]
                        lg:hidden
                    "
                />
            )}

            {/* =========================================================
                Sidebar
            ========================================================= */}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    w-72
                    transform
                    border-r border-slate-200
                    bg-white
                    shadow-xl
                    transition-transform duration-300 ease-in-out
                    lg:translate-x-0
                    lg:shadow-none

                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                <div className="flex h-full flex-col">

                    {/* Mobile Close Button */}

                    <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 lg:hidden">
                        <span className="text-sm font-semibold text-slate-900">
                            Navigation
                        </span>

                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close sidebar"
                            className="
                                rounded-lg
                                p-2
                                text-slate-500
                                transition
                                hover:bg-slate-100
                                hover:text-slate-900
                            "
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <Sidebar
                        onNavigate={() => setSidebarOpen(false)}
                    />

                </div>
            </aside>

            {/* =========================================================
                Main Application Area
            ========================================================= */}

            <div className="lg:pl-72">

                {/* =====================================================
                    Desktop / Mobile Navbar
                ===================================================== */}

                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

                        {/* Mobile Menu */}

                        <div className="flex items-center gap-3">

                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                aria-label="Open navigation"
                                className="
                                    rounded-lg
                                    p-2
                                    text-slate-600
                                    transition
                                    hover:bg-slate-100
                                    hover:text-slate-900
                                    lg:hidden
                                "
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            <div className="lg:hidden">
                                <p className="text-sm font-bold text-slate-900">
                                    Restaurant AI
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    Booking System
                                </p>
                            </div>

                        </div>

                        {/* Navbar */}

                        <div className="hidden flex-1 lg:block">
                            <Navbar />
                        </div>

                        {/* Mobile Notification */}

                        <button
                            type="button"
                            aria-label="Notifications"
                            className="
                                relative
                                rounded-lg
                                p-2
                                text-slate-600
                                transition
                                hover:bg-slate-100
                                hover:text-slate-900
                                lg:hidden
                            "
                        >
                            <Bell className="h-5 w-5" />

                            <span
                                className="
                                    absolute
                                    right-1.5
                                    top-1.5
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-red-500
                                    ring-2
                                    ring-white
                                "
                            />
                        </button>

                    </div>
                </header>

                {/* =====================================================
                    Main Content
                ===================================================== */}

                <main className="min-h-[calc(100vh-4rem)]">
                    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                        <Outlet />
                    </div>
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;