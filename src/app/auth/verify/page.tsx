"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type VerifyState = "loading" | "success" | "error";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<VerifyState>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setState("error");
        setError("No token provided");
        return;
      }

      try {
        const response = await fetch(
          `https://api.revenueinfra.com/api/auth/verify-magic-link?token=${encodeURIComponent(token)}`
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Invalid or expired link");
        }

        const data = await response.json();

        // Store the session token
        if (data.session_token) {
          localStorage.setItem("session_token", data.session_token);
        }
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
        }
        if (data.token) {
          localStorage.setItem("session_token", data.token);
        }

        setState("success");

        // Redirect to leads page after short delay
        setTimeout(() => {
          router.push("/leads");
        }, 1500);
      } catch (err) {
        setState("error");
        setError(err instanceof Error ? err.message : "Verification failed");
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="bg-card border border-border rounded-xl p-8 shadow-xl shadow-black/5">
          <div className="text-center py-4">
            {state === "loading" && (
              <>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Verifying...
                </h2>
                <p className="text-sm text-muted-foreground">
                  Please wait while we sign you in
                </p>
              </>
            )}

            {state === "success" && (
              <>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Signed in
                </h2>
                <p className="text-sm text-muted-foreground">
                  Redirecting to dashboard...
                </p>
              </>
            )}

            {state === "error" && (
              <>
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Verification failed
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {error}
                </p>
                <a
                  href="/sign-in"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Back to sign in
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
