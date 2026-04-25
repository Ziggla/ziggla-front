"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const testimonials = [
  {
    text: "Perfect location with access to public transports and amenities, funky decor and well equipped flat (fun jacuzzi bath), brilliant host.",
    author: "Rebecca",
    country: "United Kingdom",
    property: "Ziggla Luxury Properties",
  },
  {
    text: "Our host was personable, responsive, available and an absolute delight. The apartment was so cute and well decorated with a jacuzzi tub!",
    author: "Pauline",
    country: "United States",
    property: "Ziggla Luxury Apartments",
  },
  {
    text: "It was ideal for all our needs & a great location. Our host Mbi was very friendly & helpful & the apt was spotlessly clean.",
    author: "Fouad",
    country: "Ireland",
    property: "Ziggla Luxury Properties",
  },
  {
    text: "A really quirky little flat. Fully equipped kitchen, the bathroom is a riot of colour and has a lovely whirlpool tub.",
    author: "Jutta",
    country: "United Kingdom",
    property: "Ziggla Luxury Apartments",
  },
];

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const [current, setCurrent] = useState(0);

  function prev() {
    setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  }

  function next() {
    setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
  }

  return (
    <section id="testimonials" className="bg-surface py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary text-xs font-label font-semibold tracking-[0.3em] uppercase mb-6 opacity-80">
            Reviews
          </span>
          <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-light text-on-surface">
            {t("title")}
          </h2>
          <div className="mt-6 mx-auto h-px w-24 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
        </motion.div>

        <div className="relative">
          {/* Large quote */}
          <div
            className="absolute -top-8 left-0 font-headline text-8xl text-primary/20 leading-none select-none"
            aria-hidden="true"
          >
            "
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-center py-8 px-4"
            >
              <blockquote className="font-headline text-xl md:text-2xl lg:text-3xl font-light text-on-surface leading-relaxed italic mb-8">
                "{testimonials[current].text}"
              </blockquote>

              <div className="flex flex-col items-center gap-1">
                <div className="font-label font-semibold text-on-surface text-sm tracking-wide">
                  {testimonials[current].author}
                </div>
                <div className="text-on-surface-variant text-xs tracking-widest uppercase">
                  {testimonials[current].country}
                </div>
                <div className="mt-2 text-primary/70 text-xs font-body">
                  {testimonials[current].property}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container-highest hover:text-primary transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <span className="material-symbols-outlined text-xl">
                arrow_back
              </span>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? "w-6 h-2 bg-primary"
                      : "w-2 h-2 bg-on-surface-variant/30 hover:bg-on-surface-variant/60"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container-highest hover:text-primary transition-all duration-200"
              aria-label="Next testimonial"
            >
              <span className="material-symbols-outlined text-xl">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
