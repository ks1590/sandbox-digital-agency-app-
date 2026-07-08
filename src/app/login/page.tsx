import Header from "@/components/layout/Header";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#EEF1F8] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-[12px] shadow-xs p-10 w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            ログイン
          </h2>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
