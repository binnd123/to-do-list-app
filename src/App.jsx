import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import TableToDoList from "./components/table";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TableToDoList />} />

        {/* <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<RecentActivity />} />
          <Route path="project/:id" element={<Project />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
