export default function About() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">About</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white max-w-3xl leading-[1.1]">
          I'm Allan Chan — a UI developer and illustrator based in Mahwah, NJ.
        </h2>
        <p className="mt-8 text-lg text-neutral-400 leading-relaxed max-w-2xl">
          At Samsung SDS America, I own end-to-end front-end delivery for product launches, B2B
          storefronts, and enterprise service portals that reach millions of visitors monthly. I've
          shipped Galaxy flagship reserve pages, a national STEM contest platform handling thousands
          of concurrent users, and a B2B commerce system serving enterprise buyers — always with a
          focus on Core Web Vitals, accessibility, and zero-defect launches.
        </p>
        <p className="mt-4 text-lg text-neutral-400 leading-relaxed max-w-2xl">
          My background in illustration and AR gives me a rare edge: I think visually before I write
          a line of code. That cross-discipline perspective means I collaborate fluidly with
          designers, catch interaction problems early, and produce interfaces that feel intentional —
          not just functional.
        </p>
        <p className="mt-4 text-lg text-neutral-400 leading-relaxed max-w-2xl">
          I'm drawn to teams building products at scale — complex data surfaces, B2B tools,
          content-rich platforms — where thoughtful engineering and design both matter.
        </p>
      </div>
    </section>
  );
}
