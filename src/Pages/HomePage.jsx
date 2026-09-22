// import { createFileRoute } from "@tanstack/react-router";
import { useState, CSSProperties, MouseEvent } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  GraduationCap,
  Menu,
  Play,
  Quote,
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
//       { property: "og:url", content: "/" },
//       { name: "twitter:card", content: "summary_large_image" },
//     ],
//     links: [{ rel: "canonical", href: "/" }],
//   }),
//   component: HomePage,
// });

const testimonials = [
  {
    name: "Amara Chukwu",
    course: "COS 202",
    rating: 5,
    quote:
      "I was stuck on recursion for two weeks. One 12-minute video from a 300L student explained it better than three lecture slides ever did.",
  },
  {
    name: "Bala Ahmed",
    course: "PHY 101",
    rating: 5,
    quote:
      "Cheaper than a private tutor and the person teaching literally sat my exact exam last semester.",
  },
  {
    name: "Chidinma Okafor",
    course: "MTH 201",
    rating: 4,
    quote:
      "Booked a live session the night before a test. Was nervous about it working out but it genuinely saved me.",
  },
];

const popularCourses = [
  { code: "COS 202", label: "Java Programming", lessons: "24 lessons" },
  { code: "MTH 201", label: "Vector Spaces", lessons: "18 lessons" },
  { code: "PHY 101", label: "Newton's Laws", lessons: "31 lessons" },
  { code: "ACC 201", label: "Financial Accounting", lessons: "16 lessons" },
  { code: "STA 111", label: "Intro to Statistics", lessons: "22 lessons" },
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

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

function Stars({ rating }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((item) => (
        <Star
          key={item}
          className={`h-4 w-4 ${item <= rating ? "fill-gold text-gold" : "fill-none text-border"}`}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const moveSpotlight = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  const spotlightStyle = {
    "--spot-x": `${spotlight.x}%`,
    "--spot-y": `${spotlight.y}%`,
  };

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-8 px-5 sm:px-8">
          <a
            href="#top"
            className="group flex shrink-0 items-center gap-2.5 font-display text-lg font-extrabold text-primary"
          >
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
              <GraduationCap className="h-5 w-5" />
            </span>
            Priority Tutor
          </a>
          <div className="hidden items-center gap-7 md:flex">
            <a href="#how-it-works" className="nav-link">
              How it works
            </a>
            <a href="#courses" className="nav-link">
              Popular courses
            </a>
            <a href="#tutors" className="nav-link">
              Become a tutor
            </a>
          </div>
          <div className="ml-auto hidden items-center gap-5 md:flex">
            <a href="#signin" className="nav-link text-primary">
              Sign in
            </a>
            <a href="#courses" className="button-student h-10 px-5">
              Get help now
            </a>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="ml-auto grid h-10 w-10 place-items-center rounded-md text-primary transition-colors hover:bg-muted md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
        {menuOpen && (
          <div className="animate-menu border-t border-border bg-background px-5 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {[
                { label: "How it works", href: "#how-it-works" },
                { label: "Popular courses", href: "#courses" },
                { label: "Become a tutor", href: "#tutors" },
                { label: "Sign in", href: "#signin" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#courses"
                onClick={() => setMenuOpen(false)}
                className="button-student mt-2 h-11"
              >
                Get help now
              </a>
            </div>
          </div>
        )}
      </nav>

      <main id="top">
        <section
          className="hero-mesh relative isolate border-b border-border/60"
          onMouseMove={moveSpotlight}
          style={spotlightStyle}
        >
          <div className="spotlight" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:py-24">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-xs font-bold text-primary shadow-soft backdrop-blur">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                Tutorials that fit a student budget
              </span>
              <h1 className="mt-6 max-w-2xl font-display text-5xl font-extrabold leading-[1.02] text-primary sm:text-6xl lg:text-7xl">
                Learn smarter,{" "}
                <span className="text-gold-strong">not harder.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                Get affordable, course-matched help from students who have
                already aced your classes. Watch tutor videos, book sessions, or
                become a Priority Tutor yourself.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#courses"
                  className="button-student button-spotlight h-12 px-6"
                >
                  Find a tutor <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#tutors" className="button-tutor h-12 px-6">
                  Become a Priority Tutor
                </a>
              </div>
              <div className="mt-9 flex items-center gap-4">
                <div className="flex -space-x-2.5" aria-hidden="true">
                  {["SO", "AJ", "MK", "RL"].map((item, index) => (
                    <span key={item} className={`avatar avatar-${index + 1}`}>
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="font-bold text-primary">5,000+</strong>{" "}
                  students already learning
                </p>
              </div>
            </div>

            <div className="relative animate-rise-delayed lg:pl-4">
              <div className="absolute -left-5 top-10 hidden rounded-md border border-border bg-surface px-4 py-3 shadow-elevated xl:block">
                <p className="text-xs font-semibold text-muted-foreground">
                  Average lesson
                </p>
                <p className="mt-0.5 font-display text-xl font-extrabold text-primary">
                  ₦850
                </p>
              </div>
              <div className="video-shell relative rounded-xl bg-primary p-3 shadow-hero sm:p-4">
                <div className="flex items-center gap-3 px-2 pb-4 pt-1">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/15 text-gold">
                    <Play className="h-4 w-4 fill-current" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-primary-foreground">
                      Software Engineering — 300L
                    </p>
                    <p className="mt-0.5 text-xs text-primary-foreground/55">
                      Data Structures & Algorithms
                    </p>
                  </div>
                  <span className="ml-auto rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-bold text-success-soft">
                    Affordable
                  </span>
                </div>
                <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-ink-raised">
                  <div className="code-grid absolute inset-0 opacity-40" />
                  <div className="absolute left-6 top-6 font-mono text-[11px] leading-6 text-primary-foreground/30 sm:left-9 sm:top-8">
                    <p>function traverse(node) &#123;</p>
                    <p>&nbsp;&nbsp;if (!node) return;</p>
                    <p>&nbsp;&nbsp;visit(node.value);</p>
                    <p>&#125;</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Play course preview"
                    className="relative grid h-16 w-16 place-items-center rounded-full bg-gold text-gold-foreground shadow-gold transition-all duration-300 group-hover:scale-110 group-hover:shadow-gold-lg"
                  >
                    <Play className="ml-1 h-6 w-6 fill-current" />
                  </button>
                  <span className="absolute bottom-4 right-4 rounded bg-primary/70 px-2 py-1 text-[10px] font-bold text-primary-foreground backdrop-blur">
                    12:24
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 pb-1 pt-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-foreground/10 text-[10px] font-bold text-primary-foreground">
                      TO
                    </span>
                    <div>
                      <p className="text-xs font-bold text-primary-foreground">
                        Tutor test4
                      </p>
                      <p className="text-[10px] text-primary-foreground/50">
                        4.9 · 128 students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-gold">
                    <Star className="h-3.5 w-3.5 fill-current" /> 4.9
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-3 rounded-md border border-border bg-surface px-4 py-3 shadow-elevated sm:-right-6">
                <p className="flex items-center gap-2 text-xs font-bold text-primary">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-success-soft/15 text-success">
                    <Check className="h-3.5 w-3.5" />
                  </span>{" "}
                  Course-matched tutor
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="section-shell py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Simple by design</p>
            <h2 className="section-title">Help that meets you where you are</h2>
            <p className="section-copy">
              Three simple ways to get the support you need — or start helping
              others.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                number: "01",
                title: "Browse videos",
                desc: "Explore short tutorial videos made by students in your exact course and level.",
              },
              {
                icon: Users,
                number: "02",
                title: "Book help",
                desc: "Find a Priority Tutor who speaks your course language and schedule a session.",
              },
              {
                icon: GraduationCap,
                number: "03",
                title: "Become a tutor",
                desc: "Earn while you study. Share what you know and help other students succeed.",
              },
            ].map(({ icon: Icon, number, title, desc }) => (
              <article key={title} className="feature-card group">
                <div className="flex items-start justify-between">
                  <span className="icon-tile">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs font-bold text-border">
                    {number}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-xl font-extrabold text-primary">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {desc}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-primary opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-primary py-16 sm:py-20">
          <div className="section-shell grid gap-px overflow-hidden rounded-lg bg-primary-foreground/10 md:grid-cols-3">
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
              <article key={title} className="bg-primary p-7 sm:p-9">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-gold text-gold-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-xl font-extrabold text-primary-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-primary-foreground/55">
                  {desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="courses" className="section-shell py-20 sm:py-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Trending this week</p>
              <h2 className="section-title text-left">
                Popular courses right now
              </h2>
            </div>
            <a
              href="#courses"
              className="hidden items-center gap-2 text-sm font-bold text-primary sm:flex"
            >
              Browse all <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-10 flex snap-x gap-4 overflow-x-auto pb-4 scrollbar-none">
            {popularCourses.map((course, index) => (
              <article
                key={course.code}
                className="course-card group snap-start"
              >
                <div className={`course-code course-code-${(index % 3) + 1}`}>
                  <span className="relative">{course.code}</span>
                </div>
                <div className="p-4">
                  <p className="font-display text-sm font-bold text-primary">
                    {course.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {course.lessons}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-surface py-20 sm:py-24">
          <div className="section-shell">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Real student results</p>
              <h2 className="section-title">What students are saying</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <article
                  key={testimonial.name}
                  className={`testimonial-card ${index === 1 ? "md:-translate-y-4" : ""}`}
                >
                  <Quote className="h-8 w-8 text-gold/50" />
                  <div className="mt-4">
                    <Stars rating={testimonial.rating} />
                  </div>
                  <blockquote className="mt-4 text-sm leading-7 text-foreground">
                    “{testimonial.quote}”
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {initials(testimonial.name)}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-primary">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.course}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="eyebrow">Good to know</p>
              <h2 className="section-title text-left">
                Frequently asked questions
              </h2>
              <p className="section-copy text-left">
                Everything you need to know before your first lesson.
              </p>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-bold text-primary [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-muted-foreground">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="tutors" className="section-shell pb-20 sm:pb-24">
          <div className="grid overflow-hidden rounded-xl shadow-elevated md:grid-cols-2">
            <div className="bg-success p-8 sm:p-12">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-success-foreground/70">
                For high-achieving students
              </p>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-success-foreground">
                Become a Priority Tutor
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-success-foreground/80">
                Turn your notes and knowledge into income. Set your own hours,
                help students in your courses, and build your teaching
                reputation.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Earn while you learn",
                  "Set your own schedule",
                  "Get discovered by coursemates",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-bold text-success-foreground"
                  >
                    <Check className="h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center bg-primary p-8 sm:p-12">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gold">
                For every student
              </p>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-primary-foreground">
                Ready to raise your GPA?
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-primary-foreground/60">
                Join Priority Tutor today for course-matched tutorials, helpful
                tutors, and a community built for students.
              </p>
              <a
                href="#courses"
                className="button-student mt-7 h-12 w-fit px-6"
              >
                Create free account <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="section-shell py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <a
                href="#top"
                className="flex items-center gap-2 font-display font-extrabold text-primary"
              >
                <GraduationCap className="h-5 w-5" /> Priority Tutor
              </a>
              <p className="mt-3 text-sm text-muted-foreground">
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
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#top"
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
            © 2026 Priority Tutor. Learn smarter, together.
          </div>
        </div>
      </footer>
    </div>
  );
}
