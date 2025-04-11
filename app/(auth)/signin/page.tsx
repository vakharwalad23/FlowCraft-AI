import SignIn from "@/components/Auth/SignIn";

export default function SignInPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen  bg-cover bg-center"
      style={{ backgroundImage: "url('./BgAuth.png')" }}
    >
      <SignIn redirectTo="/dashboard" />
    </div>
  );
}