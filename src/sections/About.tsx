import { aboutParagraphs, modeCopy } from "../data/modeCopy";
import type { ModeId } from "../lib/mode";

export default function About({ mode }: { mode: ModeId }) {
  const order = modeCopy[mode].about.paragraphOrder;

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">About</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white max-w-3xl leading-[1.1]">
          I'm Allan Chan — a UI developer and illustrator based in Mahwah, NJ.
        </h2>
        {order.map((key, i) => (
          <p
            key={key}
            className={`${i === 0 ? "mt-8" : "mt-4"} text-lg text-neutral-400 leading-relaxed max-w-2xl`}
          >
            {aboutParagraphs[key]}
          </p>
        ))}
      </div>
    </section>
  );
}
