export default function About() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">About</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white max-w-3xl leading-[1.1]">
          I'm Allan Chan — a UI developer and illustrator based in Mahwah, NJ.
        </h2>
        <p className="mt-8 text-lg text-neutral-400 leading-relaxed max-w-2xl">
          I build scalable, accessible, and high-performance web experiences at Samsung SDS America —
          from flagship product launches to B2B commerce platforms. Before that, I led the artistic
          direction for educational XR games at Rutgers GRID Lab, producing 70+ illustrations for
          AR-powered learning experiences.
        </p>
        <p className="mt-4 text-lg text-neutral-400 leading-relaxed max-w-2xl">
          I care about pixel-perfect execution, Core Web Vitals, and the intersection of design and
          engineering — whether that's a modular AEM component, a B2B pricing surface, or a
          hand-painted animated deer.
        </p>
      </div>
    </section>
  );
}
