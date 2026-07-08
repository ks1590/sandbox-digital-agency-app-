import Header from "@/components/layout/Header";
import { login } from "@/actions/auth";

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
            <div className="flex flex-col gap-2">
              <label htmlFor="loginId" className="font-bold text-gray-900">
                ログインID
                <span className="ml-2 text-xs font-normal text-red-600 bg-red-50 border border-red-200 px-1 py-0.5 rounded-sm">
                  ※必須
                </span>
              </label>
              <input
                id="loginId"
                name="loginId"
                type="text"
                required
                className="w-full rounded-[8px] border border-gray-400 bg-white px-4 h-14 text-base text-gray-900 hover:border-black focus:outline-solid focus:outline-4 focus:outline-black focus:outline-offset-2 focus:ring-2 focus:ring-yellow-300"
                placeholder="IDを入力"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-bold text-gray-900">
                パスワード
                <span className="ml-2 text-xs font-normal text-red-600 bg-red-50 border border-red-200 px-1 py-0.5 rounded-sm">
                  ※必須
                </span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-[8px] border border-gray-400 bg-white px-4 h-14 text-base text-gray-900 hover:border-black focus:outline-solid focus:outline-4 focus:outline-black focus:outline-offset-2 focus:ring-2 focus:ring-yellow-300"
                placeholder="パスワードを入力"
              />
            </div>

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
