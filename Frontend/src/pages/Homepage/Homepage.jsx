import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Receipt,
  Star,
  Check,
  Stethoscope,
  Activity,
  Smile,
  Zap,
  Award,
} from "lucide-react";
import Navbar from "../Header/navbar";

export default function HomePage() {
  const [invoiceNo, setInvoiceNo] = useState("");
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (!invoiceNo.trim()) return;
    navigate(`/appointment/${invoiceNo.trim()}`);
  };

  return (
    // Changed font-mono to font-sans for a cleaner, more approachable look
    <div className="min-h-screen font-sans antialiased text-gray-900 bg-white selection:bg-black selection:text-white">
      <Navbar />

      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-32 pb-20 overflow-hidden sm:pt-48 sm:pb-32">
        {/* Subtle Background Gradients */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-purple-50 rounded-full blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2"></div>

        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 mb-8 text-sm font-medium text-gray-600 transition-all bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-gray-300 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex w-2.5 h-2.5 mr-3">
              <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-2.5 h-2.5 bg-green-500 rounded-full"></span>
            </span>
            Patient Portal & Tracking System
          </div>

          {/* Headline */}
          <h1 className="max-w-5xl mx-auto mb-8 text-6xl font-extrabold tracking-tight text-gray-900 duration-1000 delay-100 sm:text-7xl lg:text-8xl animate-in fade-in slide-in-from-bottom-6 fill-mode-both">
            Dental Care <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-500 to-gray-900">
              Reimagined.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg leading-8 text-gray-600 duration-1000 delay-200 sm:text-xl animate-in fade-in slide-in-from-bottom-8 fill-mode-both">
            Experience the future of dentistry. Painless treatments, world-class
            specialists, and a seamless digital journey from booking to
            recovery.
          </p>

          {/* Invoice Search Bar - Premium Look */}
          <div className="max-w-lg mx-auto mt-12 mb-12 duration-1000 delay-300 animate-in fade-in slide-in-from-bottom-10 fill-mode-both">
            <div className="relative group">
              {/* Glow effect behind search bar */}
              <div className="absolute transition duration-1000 rounded-full opacity-25 -inset-1 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 blur group-hover:opacity-50 group-hover:duration-200"></div>

              <form
                onSubmit={handleTrack}
                className="relative flex items-center p-2 transition-all bg-white border border-gray-200 rounded-full shadow-lg focus-within:ring-2 focus-within:ring-black/5 focus-within:border-gray-300 focus-within:shadow-xl"
              >
                <div className="flex items-center justify-center w-12 h-12 ml-1 text-gray-500 rounded-full bg-gray-50 shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Enter Invoice No (e.g. INV-8A92)"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value.toUpperCase())}
                  className="w-full h-12 pl-4 pr-32 text-base font-medium tracking-wide text-gray-900 uppercase bg-transparent border-none outline-none placeholder:text-gray-400 placeholder:font-normal"
                />
                <button
                  type="submit"
                  className="absolute px-6 text-sm font-bold text-white transition-all bg-black rounded-full shadow-md right-2 top-2 bottom-2 hover:bg-gray-800 hover:scale-105 active:scale-95"
                >
                  Track Status
                </button>
              </form>
            </div>
            <p className="mt-4 text-xs font-medium text-gray-400">
              Rated <span className="font-bold text-black">4.9/5</span> by over
              10,000+ happy patients.
            </p>
          </div>
        </div>
      </section>

      {/* --- 2. TREATMENTS SECTION --- */}
      <section id="treatments" className="py-32 bg-gray-50/50 scroll-mt-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto mb-20 text-center">
            <h2 className="text-base font-semibold leading-7 tracking-wide text-black uppercase">
              Our Expertise
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Specialized Treatments
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We combine art and science to give you a healthy, confident smile
              using the latest technology.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            <TreatmentCard
              icon={Activity}
              title="Root Canal Treatment"
              desc="Advanced microscopic endodontics for precise, pain-free root canal therapy."
            />
            <TreatmentCard
              icon={Smile}
              title="Cosmetic Dentistry"
              desc="Veneers, professional whitening, and full smile makeovers."
            />
            <TreatmentCard
              icon={Zap}
              title="Dental Implants"
              desc="Permanent, natural-looking solutions for missing teeth replacement."
            />
            <TreatmentCard
              icon={Stethoscope}
              title="General Checkups"
              desc="Routine cleaning, digital X-rays, and preventive care for oral health."
            />
            <TreatmentCard
              icon={Check}
              title="Orthodontics"
              desc="Invisible aligners (Invisalign) and modern braces for all ages."
            />
            <TreatmentCard
              icon={Star}
              title="Pediatric Dentistry"
              desc="Gentle, fun, and fear-free dental care designed for children."
            />
          </div>
        </div>
      </section>

      {/* --- 3. DOCTORS SECTION --- */}
      <section id="about" className="py-32 bg-white scroll-mt-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-end justify-between gap-6 mb-16 md:flex-row">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Meet Our Specialists
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Experienced professionals dedicated to your comfort and care.
              </p>
            </div>
            <Link
              to="/about"
              className="group flex items-center gap-2 text-sm font-semibold text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
            >
              View all doctors{" "}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <DoctorCard
              name="Dr. Sarah Johnson"
              role="Orthodontist"
              image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
            />
            <DoctorCard
              name="Dr. Michael Chen"
              role="Oral Surgeon"
              image="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
            />
            <DoctorCard
              name="Dr. Emily Davis"
              role="Pediatric Dentist"
              image="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2070&auto=format&fit=crop"
            />
            <DoctorCard
              name="Dr. James Wilson"
              role="Endodontist"
              image="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* --- 4. REVIEWS SECTION --- */}
      <section className="relative py-32 overflow-hidden text-white bg-gray-900">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gray-700 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gray-700 to-transparent"></div>

        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-16 mb-20 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-wider text-yellow-400 uppercase rounded-full bg-yellow-500/10">
                <Award className="w-4 h-4" />
                #1 Rated Clinic
              </div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Loved by patients.
                <br />
                Trusted by families.
              </h2>
              <p className="max-w-md text-lg text-gray-400">
                We believe in building long-term relationships with our patients
                through transparency, trust, and exceptional care.
              </p>
            </div>

            {/* Summary Stat */}
            <div className="p-8 border bg-white/5 border-white/10 rounded-2xl backdrop-blur-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">4.9</span>
                <span className="text-xl text-gray-400">/ 5</span>
              </div>
              <div className="flex gap-1 my-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Based on 2,500+ verified reviews from Google and Facebook.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <ReviewCard
              text="The best dental experience I've ever had. Dr. Sarah was incredibly gentle and explained everything perfectly. The clinic feels more like a spa!"
              author="Alex Mitchell"
              role="Patient since 2021"
              treatment="Invisalign"
            />
            <ReviewCard
              text="I was terrified of the root canal, but the team made it completely painless. The technology they use is mind-blowing. Highly recommended."
              author="Priya Kapoor"
              role="Patient since 2023"
              treatment="Root Canal"
            />
            <ReviewCard
              text="My kids actually love coming here now. The pediatric wing is amazing, colorful, and the staff knows exactly how to handle anxious children."
              author="David Ross"
              role="Father of 2"
              treatment="Pediatric Checkup"
            />
          </div>
        </div>
      </section>

      {/* --- 5. FOOTER --- */}
      <footer className="pt-16 pb-8 bg-white border-t border-gray-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 mb-12 md:grid-cols-4">
            <div className="col-span-1 md:col-span-1">
              <span className="text-xl font-bold text-gray-900">
                DentalCare.
              </span>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                Modern dentistry for the modern world. We are committed to
                providing the highest quality care in a comfortable environment.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
                Services
              </h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a href="#" className="transition-colors hover:text-black">
                    Cosmetic Dentistry
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-black">
                    Dental Implants
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-black">
                    Orthodontics
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-black">
                    Teeth Whitening
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
                Company
              </h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a href="#" className="transition-colors hover:text-black">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-black">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-black">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-black">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
                Legal
              </h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a href="#" className="transition-colors hover:text-black">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-black">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-black">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-gray-100 md:flex-row">
            <p className="text-xs text-gray-400">
              &copy; 2024 DentalCare Admin. All rights reserved.
            </p>
            <div className="flex gap-6">
              {/* Social icons placeholders */}
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function TreatmentCard({ icon: Icon, title, desc }) {
  return (
    <div className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-sm group rounded-3xl hover:shadow-xl hover:border-gray-200 hover:-translate-y-1">
      <div className="inline-flex items-center justify-center mb-6 text-black transition-colors duration-300 w-14 h-14 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
    </div>
  );
}

function DoctorCard({ name, role, image }) {
  return (
    <div className="cursor-pointer group">
      <div className="relative mb-5 overflow-hidden transition-all duration-500 bg-gray-100 shadow-md rounded-3xl aspect-4/5 group-hover:shadow-xl">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-linear-to-t from-black/20 to-transparent group-hover:opacity-100"></div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
        {name}
      </h3>
      <p className="text-sm font-medium text-gray-500">{role}</p>
    </div>
  );
}

function ReviewCard({ text, author, role, treatment }) {
  return (
    <div className="p-8 transition-colors duration-300 border bg-white/5 border-white/10 rounded-3xl hover:bg-white/10">
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="mb-8 text-base leading-relaxed text-gray-300">"{text}"</p>

      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <div>
          <span className="block text-sm font-bold text-white">{author}</span>
          <span className="block text-xs text-gray-500 mt-0.5">{role}</span>
        </div>
        <span className="px-3 py-1 text-xs font-semibold text-black bg-white rounded-full">
          {treatment}
        </span>
      </div>
    </div>
  );
}
