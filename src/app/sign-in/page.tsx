"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";

type AuthMode = "sign-in" | "request-access";

export default function SignInPage() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Reject consumer email domains
    const consumerDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "live.com", "msn.com"];
    const emailDomain = email.split("@")[1]?.toLowerCase();
    if (consumerDomains.includes(emailDomain)) {
      setError("Please use your work email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === "sign-in") {
        const response = await fetch("https://api.revenueinfra.com/api/auth/send-magic-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to send sign-in link");
        }
      } else {
        // TODO: Call request access API
        const response = await fetch("/api/auth/request-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to submit request");
        }
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setEmail("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo / Brand */}
      <div className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Revenue Activation
        </h1>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[400px]">
        <div className="bg-card border border-border rounded-lg p-8 card-elevated">
          {isSubmitted ? (
            // Success State
            <div className="text-center py-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                {mode === "sign-in" ? "Check your email" : "Request submitted"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {mode === "sign-in"
                  ? `We sent a sign-in link to ${email}`
                  : `We'll review your request and send an invite to ${email}`}
              </p>
              <button
                onClick={resetForm}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              {/* Mode Toggle */}
              <SegmentedControl
                options={[
                  { value: "sign-in", label: "Sign in" },
                  { value: "request-access", label: "Request access" },
                ]}
                value={mode}
                onChange={(newMode) => {
                  setMode(newMode);
                  setError(null);
                }}
                className="mb-8"
              />

              {/* Heading */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  {mode === "sign-in" ? "Welcome back" : "Get started"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {mode === "sign-in"
                    ? "Enter your email to receive a sign-in link"
                    : "Enter your work email to request access"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate data-form-type="other">
                <div className="space-y-2">
                  <label
                    htmlFor="user-identifier"
                    className="text-sm font-medium text-foreground"
                  >
                    Work email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <input
                      id="user-identifier"
                      name="user-identifier"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm transition-all"
                      required
                      autoComplete="username"
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "sign-in" ? "Send sign-in link" : "Request access"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/50 mt-6">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
