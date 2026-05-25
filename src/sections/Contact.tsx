export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">
          Contact
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white max-w-3xl">
          Let's build something together.
        </h2>
        <p className="mt-6 text-lg text-neutral-400 leading-relaxed max-w-xl">
          Whether you're scaling a product, launching something new, or need a front-end engineer
          who can hold their own in a design conversation — I'd love to hear about it.
        </p>
        <a
          href="mailto:achan1212@gmail.com"
          className="inline-block mt-8 text-lg text-violet-400 hover:text-violet-300 transition-colors"
        >
          achan1212@gmail.com →
        </a>
      </div>
    </section>
  );
}
