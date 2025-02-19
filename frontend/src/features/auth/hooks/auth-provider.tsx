import { createContext, useContext } from "react";
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthProviderContext);
