import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Reservations from "../pages/Reservations.jsx";
import Tables from "../pages/Tables.jsx";
import Analytics from "../pages/Analytics.jsx";
import CallLogs from "../pages/CallLogs.jsx";
import Settings from "../pages/Settings.jsx";

import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
// import ProtectedRoute from "./protectedRoutes.jsx";

const AppRoutes = () => {
    return (
        <Routes>

            {/* --------------------------------------------------------- */}
            {/* Authentication                                           */}
            {/* --------------------------------------------------------- */}

            <Route element={<AuthLayout />}>

                <Route
                    path="/login"
                    element={<Login />}
                />

            </Route>


            {/* --------------------------------------------------------- */}
            {/* Dashboard                                                 */}
            {/* --------------------------------------------------------- */}

            <Route element={<DashboardLayout />}>

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/reservations"
                    element={<Reservations />}
                />

                <Route
                    path="/tables"
                    element={<Tables />}
                />

                <Route
                    path="/analytics"
                    element={<Analytics />}
                />

                <Route
                    path="/calls"
                    element={<CallLogs />}
                />

                <Route
                    path="/settings"
                    element={<Settings />}
                />

            </Route>

            {/* <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route path="/tables" element={<Tables />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/calls" element={<CallLogs />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Route> */}


            {/* --------------------------------------------------------- */}
            {/* Default Route                                             */}
            {/* --------------------------------------------------------- */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />


            {/* --------------------------------------------------------- */}
            {/* 404                                                       */}
            {/* --------------------------------------------------------- */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

        </Routes>
    );
};

export default AppRoutes;