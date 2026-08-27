
import axios from "axios";

/*
|--------------------------------------------------------------------------
| API Configuration
|--------------------------------------------------------------------------
*/

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const api = axios.create({
    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },

    timeout: 15000,
});


/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
    (config) => {

        // IMPORTANT:
        // Login.jsx stores the token using "token"
        const token = localStorage.getItem("token");

        console.log(
            "API REQUEST:",
            config.method?.toUpperCase(),
            config.baseURL + config.url
        );

        console.log(
            "TOKEN:",
            token
        );

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(

    (response) => {
        return response;
    },

    (error) => {

        console.error(
            "API ERROR:",
            error.response?.status,
            error.response?.data
        );


        if (error.response?.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            if (
                window.location.pathname !==
                "/login"
            ) {

                window.location.href =
                    "/login";

            }

        }

        return Promise.reject(error);
    }

);


export default api;



// import axios from "axios";

// /*
// |--------------------------------------------------------------------------
// | API Configuration
// |--------------------------------------------------------------------------
// */

// const API_BASE_URL =
//     import.meta.env.VITE_API_URL ||
//     "http://localhost:5000/api";


// /*
// |--------------------------------------------------------------------------
// | Axios Instance
// |--------------------------------------------------------------------------
// */

// const api = axios.create({
//     baseURL: API_BASE_URL,

//     headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//     },

//     timeout: 15000,
// });


// /*
// |--------------------------------------------------------------------------
// | Request Interceptor
// |--------------------------------------------------------------------------
// |
// | Attach JWT token to authenticated dashboard requests.
// |
// */

// api.interceptors.request.use(
//     (config) => {
//         const token =
//             localStorage.getItem("accessToken");

//         if (token) {
//             config.headers.Authorization =
//                 `Bearer ${token}`;
//         }

//         return config;
//     },

//     (error) => {
//         return Promise.reject(error);
//     }
// );


// /*
// |--------------------------------------------------------------------------
// | Response Interceptor
// |--------------------------------------------------------------------------
// |
// | Centralized authentication handling.
// |
// */

// api.interceptors.response.use(
//     (response) => {
//         return response;
//     },

//     (error) => {
//         if (error.response?.status === 401) {
//             /*
//             |--------------------------------------------------------------
//             | Remove invalid token
//             |--------------------------------------------------------------
//             */

//             localStorage.removeItem(
//                 "accessToken"
//             );

//             /*
//             |--------------------------------------------------------------
//             | Redirect to login
//             |--------------------------------------------------------------
//             */

//             if (
//                 window.location.pathname !==
//                 "/login"
//             ) {
//                 window.location.href =
//                     "/login";
//             }
//         }

//         return Promise.reject(error);
//     }
// );


// export default api;