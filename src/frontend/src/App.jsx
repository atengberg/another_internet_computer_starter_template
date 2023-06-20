import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routing";

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App;