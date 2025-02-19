import { createContext } from "react";
import { User } from "../../../../../shared/types";
import { useCurrentUser } from "./queries";

const AuthProviderContext = createContext<User | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data } = useCurrentUser();

  return (
    <AuthProviderContext.Provider value={data}>
      {children}
    </AuthProviderContext.Provider>
  );
}
