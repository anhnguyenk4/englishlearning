import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-light py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:flex lg:items-center lg:gap-12">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
              ✨ The Future of Learning
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
              Chinh phục tiếng Anh cùng <span className="text-primary">NEDU</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 lg:mx-0 lg:text-lg">
              Personalized learning paths giúp bạn tiến bộ nhanh với lộ trình rõ ràng, quiz đa dạng và hệ thống level/badge.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/25 hover:bg-primary-hover"
              >
                Bắt đầu ngay
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link
                to="/courses"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                View Courses
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4 lg:justify-start">
              <div className="flex -space-x-3">
                <div className="h-10 w-10 rounded-full border-2 border-white bg-emerald-200" />
                <div className="h-10 w-10 rounded-full border-2 border-white bg-emerald-300" />
                <div className="h-10 w-10 rounded-full border-2 border-white bg-emerald-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">Joined by 10,000+ students this month</p>
            </div>
          </div>

          {/* Visual */}
          <div className="mt-10 flex-1 lg:mt-0">
            <div className="relative aspect-square w-full rounded-[2.5rem] bg-gradient-to-tr from-emerald-100 to-emerald-200 p-8 shadow-2xl dark:from-emerald-950 dark:to-slate-900">
              <div className="h-full w-full rounded-3xl bg-white shadow-inner flex items-center justify-center dark:bg-slate-900">
                <span className="material-symbols-outlined text-primary text-8xl opacity-90" style={{ fontVariationSettings: `'FILL' 1` }}>
                  language
                </span>
              </div>
              <div className="absolute -left-6 top-1/4 rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">DAILY GOAL</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">100% Achieved</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-6 bottom-1/4 rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-white">
                    <span className="material-symbols-outlined text-sm">local_fire_department</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">STREAK</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">15 Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-white">Why Choose NEDU</h2>
            <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-300">
              Experience a modern way of learning English with our specialized features designed for rapid improvement.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard icon="record_voice_over" title="Native Teachers" desc="Học với nội dung được thiết kế chuẩn bài + feedback rõ ràng." />
            <FeatureCard icon="psychology" title="AI Feedback" desc="Cải thiện ngữ pháp/vocabulary bằng phản hồi tức thì." />
            <FeatureCard icon="sports_esports" title="Gamified Learning" desc="Level, badge, leaderboard giúp bạn học vui và bền hơn." />
          </div>
        </div>
      </section>

      {/* Featured courses (demo) */}
      <section className="bg-slate-50 py-16 lg:py-24 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="mb-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">Featured Courses</h2>
              <p className="text-slate-500 dark:text-slate-300">Master specific skills with our expert-led modules.</p>
            </div>
            <Link className="hidden font-bold text-primary hover:underline sm:block dark:text-emerald-400" to="/courses">
              View all courses
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CourseCard tag="ADVANCED" meta="12 WEEKS" title="IELTS Masterclass" icon="workspace_premium" />
            <CourseCard tag="PROFESSIONAL" meta="8 WEEKS" title="Business English" icon="business_center" />
            <CourseCard tag="INTERMEDIATE" meta="4 WEEKS" title="Pronunciation Pro" icon="record_voice_over" />
          </div>
        </div>
      </section>

      {/* Footer (giữ ngắn gọn cho MVP) */}
      <footer className="border-t border-slate-100 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined text-lg">school</span>
              </div>
              <div>
                <p className="text-xl font-black text-primary">NEDU</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">Empowering learners globally.</p>
              </div>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} NEDU Online English Learning. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group rounded-xl border border-slate-100 bg-white p-8 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="leading-relaxed text-slate-500 dark:text-slate-300">{desc}</p>
    </div>
  )
}

function CourseCard({ tag, meta, title, icon }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition-transform hover:-translate-y-1 dark:bg-slate-900 dark:ring-slate-800">
      <div className="aspect-video bg-emerald-600 flex items-center justify-center dark:bg-emerald-500">
        <span className="material-symbols-outlined text-white text-6xl opacity-50">{icon}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{tag}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            {meta}
          </span>
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-slate-900 dark:text-white">$0</span>
          <Link
            to="/courses"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  )
}

