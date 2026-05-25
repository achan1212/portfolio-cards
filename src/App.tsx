import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";

export default function App() {
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", lightMode);
  }, [lightMode]);

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }}
    >
      <BrowserRouter>
        <Navbar lightMode={lightMode} onToggle={() => setLightMode((l) => !l)} />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ReactLenis>
  );
}
