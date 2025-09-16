"use client";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface User {
	username: string;
	email: string;
}

interface ProviderProps {
	isAuthenticated: boolean;
	setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
	user: User | null;
	setUser: Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<ProviderProps | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (context === null) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				isAuthenticated,
				setIsAuthenticated,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
