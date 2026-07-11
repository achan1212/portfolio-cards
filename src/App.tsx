import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import Navbar from "./components/layout/Navbar";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Home from "./pages/Home";
import { type ThemeId } from "./lib/theme";
import { DEFAULT_MODE, isModeId, parseMode, type ModeId } from "./lib/mode";

export default function App() {
  const [theme, setTheme] = useState<ThemeId>(
    () => (localStorage.getItem("theme") as ThemeId) ?? "dark",
  );
  // Init priority: URL param (shareable links) → localStorage → default
  const [mode, setMode] = useState<ModeId>(() => {
    const fromUrl = parseMode(new URLSearchParams(window.location.search).get("mode"));
    if (fromUrl) return fromUrl;
    const stored = localStorage.getItem("mode");
    return isModeId(stored) ? stored : DEFAULT_MODE;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
    localStorage.setItem("mode", mode);
    // Mirror to the URL so the current persona is shareable; default keeps it clean
    const url = new URL(window.location.href);
    if (mode === DEFAULT_MODE) url.searchParams.delete("mode");
    else url.searchParams.set("mode", "art");
    window.history.replaceState(null, "", url);
  }, [mode]);

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
