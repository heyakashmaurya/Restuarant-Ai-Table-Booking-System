import api from "./api.js";

/*
|--------------------------------------------------------------------------
| Analytics API Service
|--------------------------------------------------------------------------
|
| All analytics HTTP requests live here.
|
| Analytics.jsx
|      ↓
| analyticsSlice
|      ↓
| analyticsApi
|      ↓
| api.js
|      ↓
| Backend
|
|--------------------------------------------------------------------------
*/

const ANALYTICS_BASE_URL = "/analytics";


/*
|--------------------------------------------------------------------------
| Get Analytics Overview
|--------------------------------------------------------------------------
|
| GET /api/analytics/overview
|
| Optional:
|
| {
|     from: "2026-08-01",
|     to: "2026-08-28"
| }
|
|--------------------------------------------------------------------------
*/

export const getAnalyticsOverview = async ({
    from,
    to,
} = {}) => {

    const params = {};

    if (from) {
        params.from = from;
    }

    if (to) {
        params.to = to;
    }


    const response = await api.get(
        `${ANALYTICS_BASE_URL}/overview`,
        {
            params,
        }
    );


    return response.data;
};


/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

const analyticsApi = {
    getAnalyticsOverview,
};

export default analyticsApi;