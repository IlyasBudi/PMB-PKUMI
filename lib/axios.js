import axios from "axios"

const axiosInterceptorInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export default async function httpCall(method, url, data) {
  return await axiosInterceptorInstance({
    method,
    url,
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error.response?.data || error
    })
}
