import "../styles/reset.css";
import Home from "../pages/Home/Home";
import Heroes from "../pages/Heroes/Heroes";
import HeroPage from "../pages/HeroPage/HeroPage";
import NotFound from "../pages/NotFound/NotFound";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="heroes" element={<Heroes />} />
        <Route path="/hero/:id" element={<HeroPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
