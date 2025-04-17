import SignIn from "@/components/Auth/SignIn";
import { BGAuth } from "@/components/Auth/BGAuth";

export const metadata = {
  title: "FlowCraft AI | Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <BGAuth className="absolute inset-0 w-full h-full -z-10" />
      <SignIn redirectTo="/dashboard" />{" "}
    </div>
  );
}
