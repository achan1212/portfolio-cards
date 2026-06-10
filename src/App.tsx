import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import Navbar from "./components/layout/Navbar";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Home from "./pages/Home";
import { type ThemeId } from "./lib/theme";

export default function App() {
  const [theme, setTheme] = useState<ThemeId>(
    () => (localStorage.getItem("theme") as ThemeId) ?? "dark",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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
        <Navbar
          isLight={theme === "light"}
          onToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        />
        <ThemeSwitcher theme={theme} onThemeChange={setTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ReactLenis>
  );
}
