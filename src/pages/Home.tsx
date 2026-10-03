// Skills section is hidden for now — its content lives in About instead.
// The component file is kept so it can be restored without rebuilding it.
import About from "../sections/About";
import Artwork from "../sections/Artwork";
import Contact from "../sections/Contact";
import Hero from "../sections/Hero";
import Projects from "../sections/Projects";
import Resume from "../sections/Resume";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Artwork />
      <Resume />
      <Contact />
    </main>
  );
}
