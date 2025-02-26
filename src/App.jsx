import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import TableToDoList from "./components/table";
import Signin from "./pages/login";
import Signup from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<TableToDoList />} />
        <Route path="/" element={<Signin />} />
        <Route path="/register" element={<Signup />} />

        {/* <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<RecentActivity />} />
          <Route path="project/:id" element={<Project />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
