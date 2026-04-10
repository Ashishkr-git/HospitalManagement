import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Receipt,
  Star,
  CheckCircle,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import Navbar from "../Header/navbar"; // Adjusted path based on your structure

export default function HomePage() {
  const [invoiceNo, setInvoiceNo] = useState("");
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (!invoiceNo.trim()) return;
    navigate(`/appointment/${invoiceNo.trim()}`);
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      <Navbar />

      {/* --- 1. HERO SECTION --- */}
      <section className="pb-16 overflow-hidden pt-28 sm:pt-36 sm:pb-24 lg:pb-32">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-16">
            {/* Left: Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-blue-700 uppercase rounded-full bg-blue-50">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Now accepting new patients
              </div>

              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6 leading-[1.1]">
                Gentle care for <br /> your{" "}
                <span className="text-blue-600">best smile.</span>
              </h1>

              <p className="mb-8 text-lg leading-8 text-gray-600">
                We combine advanced technology with a warm, personal touch. Book
                an appointment today or track your ongoing treatment journey
                below.
              </p>

              {/* Search Bar - Clean & Solid */}
              <div className="max-w-md mb-8">
                <label className="block mb-2 ml-1 text-sm font-semibold text-gray-700">
                  Check Appointment Status
                </label>
                <form onSubmit={handleTrack} className="flex gap-2">
                  <div className="relative grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Invoice No (e.g. INV-8A92)"
                      value={invoiceNo}
                      onChange={(e) =>
                        setInvoiceNo(e.target.value.toUpperCase())
                      }
                      className="block w-full py-3 pl-10 tracking-wide text-gray-900 uppercase border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 placeholder:normal-case placeholder:text-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white transition-colors bg-black rounded-lg shadow-sm hover:bg-gray-800"
                  >
                    Track
                  </button>
                </form>
              </div>

              {/* Quick Links */}
              <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" /> Insurances
                  Accepted
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" /> Weekend
                  Slots
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative lg:h-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 aspect-4/3g:aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
                  alt="Modern Dental Clinic"
                  className="absolute inset-0 object-cover w-full h-full"
                />

                <div className="absolute flex items-center justify-between p-4 border border-gray-100 shadow-lg bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-xl">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Emergency?
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      Call us 24/7
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full">
                    <Phone className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. INFO BAR --- */}
      <div className="border-gray-100 bg-gray-50 border-y">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <InfoItem
              icon={Clock}
              title="Opening Hours"
              desc="Mon-Sat: 9am - 8pm"
            />
            <InfoItem
              icon={MapPin}
              title="Visit Us"
              desc="123 Health Avenue, Medical District"
            />
            <InfoItem
              icon={Star}
              title="Top Rated"
              desc="4.9/5 from 2,000+ Reviews"
            />
          </div>
        </div>
      </div>

      {/* --- 3. SERVICES (Added ID="treatments") --- */}
      <section id="treatments" className="py-24 bg-white scroll-mt-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 mb-16 md:flex-row md:items-end">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Comprehensive Treatments
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                From routine checkups to complex surgeries, our specialized
                departments cover every aspect of oral health.
              </p>
            </div>
            <Link
              to="/about"
              className="flex items-center font-semibold text-blue-600 transition-all hover:gap-2"
            >
              View full price list <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              "General Dentistry",
              "Orthodontics",
              "Oral Surgery",
              "Cosmetic Dentistry",
              "Pediatric Care",
              "Periodontics",
            ].map((service) => (
              <div
                key={service}
                className="p-6 transition-all duration-300 bg-white border border-gray-100 group rounded-xl hover:border-gray-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-center w-10 h-10 mb-4 text-blue-600 transition-colors rounded-lg bg-blue-50 group-hover:bg-blue-600 group-hover:text-white">
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 -rotate-45 group-hover:rotate-0" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{service}</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Expert care utilizing the latest technology for optimal
                  results.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. TEAM SECTION (Added ID="about") --- */}
      <section id="about" className="py-24 bg-gray-50 scroll-mt-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Meet Our Doctors
            </h2>
            <p className="mt-4 text-gray-600">
              Decades of experience across all dental specialties.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <DoctorProfile
              name="Dr. Sarah Johnson"
              role="Orthodontist"
              img="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
            />
            <DoctorProfile
              name="Dr. Michael Chen"
              role="Oral Surgeon"
              img="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
            />
            <DoctorProfile
              name="Dr. Emily Davis"
              role="Pediatric Dentist"
              img="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2070&auto=format&fit=crop"
            />
            <DoctorProfile
              name="Dr. James Wilson"
              role="Endodontist"
              img="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* --- 5. TESTIMONIALS --- */}
      <section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-gray-900">
            Patient Reviews
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <ReviewItem
              text="I've always been afraid of the dentist, but Dr. Chen made me feel so comfortable. The procedure was quick and painless."
              author="Jessica M."
            />
            <ReviewItem
              text="The staff is incredibly friendly and professional. I tracked my Invisalign progress through their portal and it was seamless."
              author="Mark T."
            />
            <ReviewItem
              text="State of the art facility. Clean, modern, and they really respect your appointment time. Highly recommended."
              author="Sarah L."
            />
          </div>
        </div>
      </section>

      {/* --- 6. FOOTER --- */}
      <footer className="py-12 text-white bg-gray-900 border-t border-gray-800">
        <div className="grid grid-cols-1 gap-8 px-4 mx-auto text-sm max-w-7xl sm:px-6 lg:px-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold">DentalCare.</h3>
            <p className="text-gray-400">
              Providing quality dental care to the community since 2010.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-gray-300">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white">
                  Staff Login
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-gray-300">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>(555) 123-4567</li>
              <li>hello@dentalcare.com</li>
              <li>Emergency: Dial 108</li>
            </ul>
          </div>
        </div>
        <div className="px-4 pt-8 mx-auto mt-12 text-xs text-center text-gray-500 border-t border-gray-800 max-w-7xl sm:px-6 lg:px-8">
          © 2024 DentalCare Admin. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// --- CLEANER SUB-COMPONENTS ---

function InfoItem({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 text-blue-600 bg-white border border-gray-200 rounded-lg shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}

function DoctorProfile({ name, role, img }) {
  return (
    <div className="overflow-hidden transition-shadow bg-white border border-gray-100 rounded-xl hover:shadow-lg">
      <div className="w-full bg-gray-200 aspect-4/5">
        <img src={img} alt={name} className="object-cover w-full h-full" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
        <p className="text-sm font-medium text-blue-600">{role}</p>
      </div>
    </div>
  );
}

function ReviewItem({ text, author }) {
  return (
    <div className="p-6 bg-gray-50 rounded-2xl">
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="mb-4 italic text-gray-700">"{text}"</p>
      <p className="text-sm font-bold text-gray-900">- {author}</p>
    </div>
  );
}
