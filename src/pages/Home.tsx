import About from "../sections/About";
import Artwork from "../sections/Artwork";
import Contact from "../sections/Contact";
import Hero from "../sections/Hero";
import Projects from "../sections/Projects";
import Resume from "../sections/Resume";
import Skills from "../sections/Skills";
import type { ModeId } from "../lib/mode";

type HomeProps = {
  mode: ModeId;
  onModeChange: (m: ModeId) => void;
};

export default function Home({ mode, onModeChange }: HomeProps) {
  // Artistic mode leads with artwork; technical mode leads with skills + dev work.
  // Skills is keyed by mode so the GSAP deal-in re-runs when the deck changes.
  const middle =
    mode === "artistic" ? (
      <>
        <Artwork mode={mode} onModeChange={onModeChange} />
        <Projects mode={mode} />
        <Skills key={mode} mode={mode} />
      </>
    ) : (
      <>
        <Skills key={mode} mode={mode} />
        <Projects mode={mode} />
        <Artwork mode={mode} onModeChange={onModeChange} />
      </>
    );

  return (
    <main>
      <Hero mode={mode} />
      <About mode={mode} />
      {middle}
      <Resume mode={mode} />
      <Contact mode={mode} />
    </main>
  );
}
