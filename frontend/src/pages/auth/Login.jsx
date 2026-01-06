import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth.store";
import { ROUTES } from "@/lib/constants";
function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate(ROUTES.UPLOAD);
  };
  return <div className="space-y-8"><div className="text-center space-y-2"><h1 className="text-3xl font-semibold">Sign in to MeetOps</h1><p className="text-muted-foreground">Turn meetings into action</p></div><form onSubmit={handleSubmit} className="space-y-4"><div className="space-y-2"><label className="text-sm font-medium">Email</label><Input
    type="email"
    placeholder="you@company.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    icon={<Mail className="h-4 w-4" />}
    required
  /></div><div className="space-y-2"><label className="text-sm font-medium">Password</label><Input
    type="password"
    placeholder="••••••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  /></div><Button type="submit" className="w-full" loading={isLoading}>
          Sign In with Email
        </Button></form><div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div></div><Button variant="outline" className="w-full">
        Continue with SSO
      </Button><div className="space-y-2 text-center text-sm"><p className="text-muted-foreground">
          Don't have an account?{" "}<Link to={ROUTES.SIGNUP} className="text-primary hover:underline">
            Sign Up
          </Link></p><p><Link to="#" className="text-muted-foreground hover:text-foreground">
            Forgot password?
          </Link></p></div></div>;
}
export {
  Login as default
};
