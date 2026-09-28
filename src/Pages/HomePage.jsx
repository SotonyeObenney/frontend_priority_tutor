// import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  GraduationCap,
  Menu,
  Play,
  Star,
  Users,
  Wallet,
  X,
} from "lucide-react";

// export const Route = createFileRoute("/")({
//   head: () => ({
//     meta: [
//       { title: "Priority Tutor — Learn Smarter, Together" },
//       {
//         name: "description",
//         content:
//           "Affordable course-matched tutorials and peer tutoring for Nigerian university students.",
//       },
//       {
//         property: "og:title",
//         content: "Priority Tutor — Learn Smarter, Together",
//       },
//       {
//         property: "og:description",
//         content:
//           "Affordable course-matched tutorials and peer tutoring for Nigerian university students.",
//       },
//       { property: "og:type", content: "website" },
//       { name: "twitter:card", content: "summary_large_image" },
//     ],
//   }),
//   component: HomePage,
// });

const NAVY = "#0f2440";
const GOLD = "#f2b01e";
const GREEN = "#15803d";
const CREAM = "#fbf7ef";

const popularCourses = [
  { code: "COS 202", label: "Java Programming", lessons: "24 lessons" },
  { code: "MTH 201", label: "Vector Spaces", lessons: "18 lessons" },
  { code: "PHY 101", label: "Newton's Laws", lessons: "31 lessons" },
  { code: "ACC 201", label: "Financial Accounting", lessons: "16 lessons" },
  { code: "STA 111", label: "Intro to Statistics", lessons: "22 lessons" },
];

const testimonials = [
  {
    name: "Amara Chukwu",
    course: "COS 202",
    quote:
      "I was stuck on recursion for two weeks. One 12-minute video from a 300L student explained it better than three lecture slides ever did.",
  },
  {
    name: "Bala Ahmed",
    course: "PHY 101",
    quote:
      "Cheaper than a private tutor and the person teaching literally sat my exact exam last semester.",
  },
  {
    name: "Chidinma Okafor",
    course: "MTH 201",
    quote:
      "Booked a live session the night before a test. Was nervous about it working out but it genuinely saved me.",
  },
];

const faqs = [
  {
    q: "How much do videos cost?",
    a: "Most videos are priced between ₦500 and ₦2,000, set individually by each tutor. Many introductory topics are free.",
  },
  {
    q: "Is my university supported?",
    a: "Priority Tutor works with any Nigerian university — tutors upload content tagged to their own course codes, so coverage grows as more students join from your school.",
  },
  {
    q: "How do I become a tutor?",
    a: "Apply with a short bio and the courses you're confident teaching. An admin reviews every application before you can upload videos or take bookings.",
  },
  {
    q: "What if a video doesn't help me?",
    a: "You can leave a review after watching, and we use ratings to surface the best tutors for each course over time.",
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Popular courses", href: "#courses" },
    { label: "Become a tutor", href: "#tutors" },
  ];

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: CREAM, color: NAVY }}
    >
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#fbf7ef]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-5">
          <a
            href="#top"
            className="flex items-center gap-2 text-lg font-extrabold"
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-lg text-white"
              style={{ backgroundColor: NAVY }}
            >
              <GraduationCap className="h-5 w-5" />
            </span>
            Priority Tutor
          </a>
          <div className="hidden items-center gap-6 text-sm font-semibold md:flex">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="ml-auto hidden items-center gap-4 md:flex">
            <a href="#signin" className="text-sm font-semibold">
              Sign in
            </a>
            <a
              href="#courses"
              className="rounded-lg px-4 py-2.5 text-sm font-bold text-[#0f2440] transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: GOLD }}
            >
              Get help now
            </a>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="ml-auto grid h-10 w-10 place-items-center rounded-lg hover:bg-black/5 md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-black/10 px-5 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {[...navLinks, { label: "Sign in", href: "#signin" }].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-black/5"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#courses"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-lg py-3 text-center text-sm font-bold"
                style={{ backgroundColor: GOLD }}
              >
                Get help now
              </a>
            </div>
          </div>
        )}
      </nav>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-bold shadow-sm">
              <Star
                className="h-3.5 w-3.5"
                style={{ color: GOLD, fill: GOLD }}
              />
              Tutorials that fit a student budget
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] sm:text-6xl">
              Learn smarter, <span style={{ color: GOLD }}>not harder.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 opacity-70 sm:text-lg">
              Get affordable, course-matched help from students who have already
              aced your classes. Watch tutor videos, book sessions, or become a
              Priority Tutor yourself.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#courses"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: GOLD }}
              >
                Find a tutor <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#tutors"
                className="inline-flex h-12 items-center justify-center rounded-lg px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: GREEN }}
              >
                Become a Priority Tutor
              </a>
            </div>
            <p className="mt-8 text-sm opacity-70">
              <strong className="font-bold opacity-100">5,000+</strong> students
              already learning
            </p>
          </div>

          {/* Video preview card */}
          <div
            className="rounded-2xl p-4 shadow-2xl"
            style={{ backgroundColor: NAVY }}
          >
            <div className="flex items-center gap-3 px-1 pb-4">
              <span
                className="grid h-10 w-10 place-items-center rounded-full"
                style={{
                  backgroundColor: "rgba(242,176,30,0.15)",
                  color: GOLD,
                }}
              >
                <Play className="h-4 w-4 fill-current" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">
                  Software Engineering — 300L
                </p>
                <p className="text-xs text-white/50">
                  Data Structures & Algorithms
                </p>
              </div>
            </div>
            <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-black/40">
              <button
                type="button"
                aria-label="Play course preview"
                className="grid h-16 w-16 place-items-center rounded-full transition-transform group-hover:scale-110"
                style={{ backgroundColor: GOLD }}
              >
                <Play className="ml-1 h-6 w-6 fill-current text-[#0f2440]" />
              </button>
              <span className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-[10px] font-bold text-white">
                12:24
              </span>
            </div>
            <div className="flex items-center justify-between px-1 pt-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-[10px] font-bold text-white">
                  TO
                </span>
                <div>
                  <p className="text-xs font-bold text-white">Tutor test4</p>
                  <p className="text-[10px] text-white/50">
                    4.9 · 128 students
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-1 text-xs font-bold"
                style={{ color: GOLD }}
              >
                <Star className="h-3.5 w-3.5 fill-current" /> 4.9
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto max-w-6xl px-5 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest opacity-50">
              Simple by design
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Help that meets you where you are
            </h2>
            <p className="mt-3 text-sm leading-7 opacity-70">
              Three simple ways to get the support you need — or start helping
              others.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Browse videos",
                desc: "Explore short tutorial videos made by students in your exact course and level.",
              },
              {
                icon: Users,
                title: "Book help",
                desc: "Find a Priority Tutor who speaks your course language and schedule a session.",
              },
              {
                icon: GraduationCap,
                title: "Become a tutor",
                desc: "Earn while you study. Share what you know and help other students succeed.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-lg"
                  style={{
                    backgroundColor: "rgba(242,176,30,0.15)",
                    color: GOLD,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-7 opacity-70">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Why Priority Tutor */}
        <section style={{ backgroundColor: NAVY }} className="py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-3">
            {[
              {
                icon: Wallet,
                title: "Budget-friendly",
                desc: "Tutorials priced for students. No expensive agencies or hidden fees.",
              },
              {
                icon: Award,
                title: "Course-matched",
                desc: "Tutors from your faculty, department, and level who understand your exact syllabus.",
              },
              {
                icon: Users,
                title: "Peer tutors",
                desc: "Learn from students who recently passed the same courses you're taking now.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <article key={title}>
                <span
                  className="grid h-11 w-11 place-items-center rounded-lg"
                  style={{ backgroundColor: GOLD, color: NAVY }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-white/60">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Popular courses */}
        <section id="courses" className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest opacity-50">
                Trending this week
              </p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Popular courses right now
              </h2>
            </div>
            <a
              href="#courses"
              className="hidden items-center gap-2 text-sm font-bold sm:flex"
            >
              Browse all <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-4">
            {popularCourses.map((course) => (
              <article
                key={course.code}
                className="w-48 shrink-0 snap-start overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="grid h-24 place-items-center font-mono text-lg font-bold text-white"
                  style={{ backgroundColor: NAVY }}
                >
                  {course.code}
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold">{course.label}</p>
                  <p className="mt-1 text-xs opacity-60">{course.lessons}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-y border-black/10 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-widest opacity-50">
                Real student results
              </p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                What students are saying
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <article
                  key={t.name}
                  className="rounded-2xl border border-black/10 bg-[#fbf7ef] p-6 shadow-sm"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="h-4 w-4"
                        style={{ color: GOLD, fill: GOLD }}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm leading-7">
                    “{t.quote}”
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3 border-t border-black/10 pt-5">
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: NAVY }}
                    >
                      {t.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs opacity-60">{t.course}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest opacity-50">
                Good to know
              </p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-3 text-sm leading-7 opacity-70">
                Everything you need to know before your first lesson.
              </p>
            </div>
            <div className="divide-y divide-black/10 border-y border-black/10">
              {faqs.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-bold [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="max-w-2xl pb-5 text-sm leading-7 opacity-70">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Split CTA */}
        <section id="tutors" className="mx-auto max-w-6xl px-5 pb-16 sm:pb-20">
          <div className="grid overflow-hidden rounded-2xl shadow-xl md:grid-cols-2">
            <div className="p-8 sm:p-10" style={{ backgroundColor: GREEN }}>
              <p className="text-xs font-extrabold uppercase tracking-widest text-white/70">
                For high-achieving students
              </p>
              <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                Become a Priority Tutor
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/80">
                Turn your notes and knowledge into income. Set your own hours,
                help students in your courses, and build your teaching
                reputation.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Earn while you learn",
                  "Set your own schedule",
                  "Get discovered by coursemates",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-bold text-white"
                  >
                    <Check className="h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="flex flex-col justify-center p-8 sm:p-10"
              style={{ backgroundColor: NAVY }}
            >
              <p
                className="text-xs font-extrabold uppercase tracking-widest"
                style={{ color: GOLD }}
              >
                For every student
              </p>
              <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                Ready to raise your GPA?
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/60">
                Join Priority Tutor today for course-matched tutorials, helpful
                tutors, and a community built for students.
              </p>
              <a
                href="#courses"
                className="mt-6 inline-flex h-12 w-fit items-center gap-2 rounded-lg px-6 text-sm font-bold"
                style={{ backgroundColor: GOLD }}
              >
                Create free account <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <a href="#top" className="flex items-center gap-2 font-extrabold">
                <GraduationCap className="h-5 w-5" /> Priority Tutor
              </a>
              <p className="mt-3 text-sm opacity-60">
                Learn smarter, together.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["How it works", "Browse videos", "Become a tutor"],
              },
              { title: "Company", links: ["About", "Contact"] },
              { title: "Legal", links: ["Privacy policy", "Terms of service"] },
            ].map((group) => (
              <div key={group.title}>
                <p className="text-xs font-extrabold uppercase tracking-widest">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#top"
                        className="text-sm opacity-60 transition-opacity hover:opacity-100"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-black/10 pt-6 text-xs opacity-60">
            © 2026 Priority Tutor. Learn smarter, together.
          </div>
        </div>
      </footer>
    </div>
  );
}
