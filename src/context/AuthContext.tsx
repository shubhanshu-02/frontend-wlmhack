import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { User } from "../types";
import { authAPI } from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("auth_token");
    const userData = Cookies.get("user_data");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        Cookies.remove("auth_token");
        Cookies.remove("user_data");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });

    Cookies.set("auth_token", response.token, { expires: 1 }); // 1 day

    // Try to get stored user data from cookies
    const storedUserData = Cookies.get("user_data");
    let userData;

    if (storedUserData) {
      try {
        userData = JSON.parse(storedUserData);
        // Update the email in case it changed
        userData.email = email;
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        userData = null;
      }
    }

    // If no stored data, create a default customer user
    if (!userData) {
      userData = {
        _id: "temp-id",
        name: email.split("@")[0],
        email: email,
        role: "customer" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    Cookies.set("user_data", JSON.stringify(userData), { expires: 1 });
    setUser(userData);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => {
    await authAPI.register({ name, email, password, role });

    // After successful registration, we need to login to get the token
    // Pass the role to login so it can be used in user creation
    await loginWithRole(email, password, role);
  };

  const loginWithRole = async (
    email: string,
    password: string,
    role?: string
  ) => {
    const response = await authAPI.login({ email, password });

    Cookies.set("auth_token", response.token, { expires: 1 }); // 1 day

    const userRole: "customer" | "partner" | "admin" =
      (role as "customer" | "partner" | "admin") || "customer";

    const userData = {
      _id: "temp-id",
      name: email.split("@")[0], // Use email prefix as name
      email: email,
      role: userRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    Cookies.set("user_data", JSON.stringify(userData), { expires: 1 });
    setUser(userData);
  };

  const logout = () => {
    authAPI.logout();
    Cookies.remove("user_data");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
