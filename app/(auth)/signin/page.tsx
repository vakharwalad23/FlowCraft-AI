import SignIn from "@/components/Auth/SignIn";

export default function SignInPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <SignIn redirectTo="/dashboard" />
    </div>
  );
}
