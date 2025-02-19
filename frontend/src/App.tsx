import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Puzzle from "./features/jigsaw/components/puzzle";
import { AuthProvider } from "./features/users/hooks/auth-provider";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Puzzle />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
