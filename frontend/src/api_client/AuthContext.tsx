"use client";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { AxiosInstance } from "axios";
import { APIClient } from "./APIClient";
import { toast } from "sonner";

export interface User {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
}

interface ProviderProps {
	isAuthenticated: boolean;
	setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
	user: User | null;
	setUser: Dispatch<SetStateAction<User | null>>;
	api: APIClient;
	axiosPrivate: AxiosInstance;
	logout: () => void;
	login: (token: string, userData: User) => void;
	loading: boolean;
	setLoading: Dispatch<SetStateAction<boolean>>;
}

const api = new APIClient("http://localhost:8008");

const AuthContext = createContext<ProviderProps | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (context === null) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const login = (token: string, userData: User) => {
		setIsAuthenticated(true);
		api.setAccessToken(token);
		setUser(userData);
	};

	const logout = () => {
		setIsAuthenticated(false);
		api.clearAccessToken();
		setUser(null);
	};

	useEffect(() => {
		async function initAuth() {
			try {
				const { token, userData } = await api.refresh();
				if (token && userData) {
					login(token, userData);
				} else {
					logout();
				}
			} catch (error) {
				toast.info("Silent Refresh Failed", { position: "top-center" });
				console.log("[initAuth]", error);
				logout();
			} finally {
				setLoading(false);
			}
		}

		initAuth();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				api,
				user,
				login,
				logout,
				setUser,
				loading,
				setLoading,
				isAuthenticated,
				setIsAuthenticated,
				axiosPrivate: api.client,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
