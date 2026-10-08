"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;

    if (role === "admin") router.push("/dashboard");
    else if (role === "client") router.push("/portal");
    else router.push("/");
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* LEFT SIDE - Professional Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80"
          alt="Professional workspace with laptop and coffee"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/90 via-[#1D4ED8]/80 to-[#1E3A8A]/90" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xl group-hover:scale-105 transition-all">
              <span className="text-white font-bold text-xl" style={{ fontWeight: 700 }}>Y</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-lg leading-tight" style={{ fontWeight: 700 }}>
                Yugesh Bastola
              </span>
              <span className="text-blue-100 text-xs leading-tight" style={{ fontWeight: 400 }}>
                Full Stack Developer
              </span>
            </div>
          </Link>

          {/* Center Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-5xl leading-tight" style={{ fontWeight: 800 }}>
                Welcome to<br />Your Dashboard
              </h2>
              <p className="text-blue-100 text-lg max-w-md" style={{ fontWeight: 400 }}>
                Manage your portfolio, projects, and client communications all in one secure place.
              </p>
            </div>

            <div className="space-y-3 mt-8">
              {[
                "Real-time project tracking",
                "Secure client communications",
                "Portfolio analytics & insights",
                "Seamless content management"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/90" style={{ fontWeight: 500 }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="space-y-3">
            <p className="text-white/80 text-sm italic" style={{ fontWeight: 400 }}>
              "Building scalable solutions, one project at a time."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <span className="text-white font-bold" style={{ fontWeight: 700 }}>Y</span>
              </div>
              <div>
                <p className="text-white text-sm" style={{ fontWeight: 600 }}>Yugesh Bastola</p>
                <p className="text-blue-200 text-xs" style={{ fontWeight: 400 }}>Full Stack Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-xl" style={{ fontWeight: 700 }}>Y</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#18181B] text-base leading-tight" style={{ fontWeight: 600 }}>
                  Yugesh
                </span>
                <span className="text-gray-500 text-xs leading-tight" style={{ fontWeight: 400 }}>
                  Developer
                </span>
              </div>
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl text-[#18181B]" style={{ fontWeight: 800 }}>
              Welcome Back
            </h1>
            <p className="text-gray-600" style={{ fontWeight: 400 }}>
              Sign in to access your dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600" style={{ fontWeight: 600 }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-700" style={{ fontWeight: 600 }}>
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@rosewood.com"
                className="h-12 text-base"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-700" style={{ fontWeight: 600 }}>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 text-base pr-12"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} className="mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="space-y-4 pt-4">
            <div className="text-center text-sm text-gray-600" style={{ fontWeight: 400 }}>
              Need access?{" "}
              <Link 
                href="/portal/register" 
                className="text-[#2563EB] hover:text-[#1D4ED8] transition"
                style={{ fontWeight: 600 }}
              >
                Request to work together
              </Link>
            </div>

            <div className="text-center">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[#2563EB] transition text-sm"
                style={{ fontWeight: 500 }}
              >
                <ArrowLeft size={16} />
                Back to portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
