import Header from "@/components/layout/Header";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="rounded-[12px] p-10 w-full max-w-md border border-gray-400">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            ログイン
          </h2>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
