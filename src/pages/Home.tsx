import About from "../sections/About";
import Artwork from "../sections/Artwork";
import Contact from "../sections/Contact";
import Hero from "../sections/Hero";
import Projects from "../sections/Projects";
import Resume from "../sections/Resume";
import Skills from "../sections/Skills";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Artwork />
      <Resume />
      <Contact />
    </main>
  );
}
