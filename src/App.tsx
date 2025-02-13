import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Jigsaw from "./features/jigsaw/components/jigsaw";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Jigsaw />
    </QueryClientProvider>
  );
}

export default App;
