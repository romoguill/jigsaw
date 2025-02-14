import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Puzzle from "./features/jigsaw/components/puzzle";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Puzzle />
    </QueryClientProvider>
  );
}

export default App;
