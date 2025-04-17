import SignIn from "@/components/Auth/SignIn";

export const metadata = {
  title: "FlowCraft AI | Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen  bg-cover bg-center"
      style={{ backgroundImage: "url('./BgAuth.svg')" }}
    >
      <SignIn redirectTo="/dashboard" />
    </div>
  );
}
