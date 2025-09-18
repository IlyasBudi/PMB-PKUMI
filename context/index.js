import { createContext, useContext } from "react"

export const UserContext = createContext({})
export const AppContext = createContext({})

export const useUserContext = () => useContext(UserContext)
export const useAppContext = () => useContext(AppContext)
