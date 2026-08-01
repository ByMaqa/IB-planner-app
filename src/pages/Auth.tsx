import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/logo.svg";
import { ArrowRight, Loader2, Mail, Terminal, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface AuthProps { redirectAfterAuth?: string; }

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirectAfterAuth || "/dashboard");
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); setError(null);
    try {
      const fd = new FormData(e.currentTarget);
      await signIn("email-otp", fd);
      setStep({ email: fd.get("email") as string });
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to send code."); }
    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); setError(null);
    try {
      const fd = new FormData(e.currentTarget);
      await signIn("email-otp", fd);
      navigate(redirectAfterAuth || "/dashboard");
    } catch { setError("Incorrect code."); setOtp(""); }
    setIsLoading(false);
  };

  const handleGuestLogin = async () => {
    setIsLoading(true); setError(null);
    try { await signIn("anonymous"); navigate(redirectAfterAuth || "/dashboard"); }
    catch (err) { setError(`Guest login failed: ${err instanceof Error ? err.message : "Unknown"}`); }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col crt">
      <div className="flex-1 flex items-center justify-center">
        <Card className="min-w-[350px] pb-0 border shadow-md bg-card">
          {step === "signIn" ? (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center">
                  <img src={logo} alt="Logo" width={56} height={56} className="rounded cursor-pointer mb-3 mt-2" onClick={() => navigate("/")} />
                </div>
                <CardTitle className="text-base font-mono"><span className="text-muted-foreground">$</span> {isLoading ? "authenticating..." : "get_started"}<span className="terminal-cursor inline-block ml-1" /></CardTitle>
                <CardDescription className="text-xs font-mono">Enter your email to log in or sign up</CardDescription>
              </CardHeader>
              <form onSubmit={handleEmailSubmit}>
                <CardContent>
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input name="email" placeholder="name@example.com" type="email" className="pl-9 font-mono text-xs" disabled={isLoading} required />
                    </div>
                    <Button type="submit" variant="outline" size="icon" disabled={isLoading} className="border-primary text-primary hover:bg-primary/10">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                  {error && <p className="mt-2 text-xs text-red-400 font-mono">Error: {error}</p>}
                  <div className="mt-4">
                    <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-[10px] uppercase font-mono"><span className="bg-card px-2 text-muted-foreground">or</span></div></div>
                    <Button type="button" variant="outline" className="w-full mt-4 font-mono text-xs" onClick={handleGuestLogin} disabled={isLoading}><UserX className="mr-2 h-4 w-4" />Continue as Guest</Button>
                  </div>
                </CardContent>
              </form>
            </>
          ) : (
            <>
              <CardHeader className="text-center mt-4">
                <CardTitle className="text-base font-mono"><span className="text-muted-foreground">$</span> check_mail</CardTitle>
                <CardDescription className="text-xs font-mono">We've sent a code to {step.email}</CardDescription>
              </CardHeader>
              <form onSubmit={handleOtpSubmit}>
                <CardContent className="pb-4">
                  <input type="hidden" name="email" value={step.email} />
                  <input type="hidden" name="code" value={otp} />
                  <div className="flex justify-center">
                    <InputOTP value={otp} onChange={setOtp} maxLength={6} disabled={isLoading}>
                      <InputOTPGroup>{Array.from({ length: 6 }).map((_, i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
                    </InputOTP>
                  </div>
                  {error && <p className="mt-2 text-xs text-red-400 text-center font-mono">{error}</p>}
                  <p className="text-xs text-muted-foreground text-center mt-4 font-mono">Didn't receive a code? <Button variant="link" className="p-0 h-auto text-primary" onClick={() => setStep("signIn")}>Try again</Button></p>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button type="submit" className="w-full font-mono text-xs" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : <>Verify code<ArrowRight className="ml-2 h-4 w-4" /></>}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setStep("signIn")} disabled={isLoading} className="w-full font-mono text-xs">Use different email</Button>
                </CardFooter>
              </form>
            </>
          )}
          <div className="py-3 px-6 text-[10px] text-center text-muted-foreground bg-secondary/50 border-t font-mono">
            <Terminal className="inline-block h-3 w-3 mr-1" />Secured by <a href="https://freebuff.com" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">freebuff.com</a>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return <Suspense><Auth {...props} /></Suspense>;
}
