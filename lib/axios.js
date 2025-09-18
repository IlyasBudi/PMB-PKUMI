import axios from "axios"

const axiosInterceptorInstance = axios.create({
  baseURL: process.env.BASE_URL,
})

// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default async function httpCall(method, url, data) {
  return await axiosInterceptorInstance({
    method,
    url,
    data,
  })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error.response.data
    })
}
