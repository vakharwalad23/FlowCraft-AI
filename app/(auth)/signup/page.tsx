import SignUp from "@/components/Auth/SignUp";

export default function SignUpPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen py-12 bg-cover bg-center"
      style={{ backgroundImage: "url('./BgAuth.svg')" }}
    >
      <SignUp redirectTo="/dashboard" />
    </div>
  );
}
