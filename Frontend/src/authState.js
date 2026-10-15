import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

// components call useAuth() to get { user, loading, login, signup, logout, ... }
export const useAuth = () => useContext(AuthContext);
