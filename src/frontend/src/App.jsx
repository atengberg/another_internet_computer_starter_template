
import AppRoutes from "./Routing";
import useCanister from "./hooks/useCanister";

const App = () => {

  // Could also use useCanister in AppRoutes, just here for demonstration.
  const { isAuthenticated } = useCanister();

  return (
    <AppRoutes isAuthenticated={isAuthenticated} />
  )
};

export default App;
