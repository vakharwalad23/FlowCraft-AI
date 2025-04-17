import SignUp from "@/components/Auth/SignUp";
import { BGAuth } from "@/components/Auth/BGAuth";

export const metadata = {
  title: "FlowCraft AI | Sign Up",
  description: "Create a new account",
};

export default function SignUpPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen py-12 overflow-hidden">
      {" "}
      <BGAuth className="absolute inset-0 w-full h-full -z-10" />{" "}
      <SignUp redirectTo="/dashboard" />
    </div>
  );
}
