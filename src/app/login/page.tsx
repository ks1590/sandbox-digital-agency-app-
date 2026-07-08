import { login } from "@/actions/auth";
import { TextInput } from "@/components/form/TextInput";
import Header from "@/components/layout/Header";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#EEF1F8] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-[12px] shadow-xs p-10 w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            ログイン
          </h2>
          <form action={login} className="space-y-6">
            <TextInput
              label="ログインID"
              id="loginId"
              name="loginId"
              type="text"
              required
              placeholder="IDを入力"
            />
            <TextInput
              label="パスワード"
              id="password"
              name="password"
              type="password"
              required
              placeholder="パスワードを入力"
            />
            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center min-h-[56px] rounded-[8px] border-4 border-double border-transparent bg-[#0017C1] text-white px-4 py-3 text-base font-bold underline-offset-[3px] transition-colors hover:bg-blue-900 hover:underline active:bg-blue-950 active:underline focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
              >
                ログイン
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
