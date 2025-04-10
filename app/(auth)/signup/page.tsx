import SignUp from "@/components/Auth/SignUp";

export default function SignUpPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <SignUp redirectTo="/dashboard" />
    </div>
  );
}
