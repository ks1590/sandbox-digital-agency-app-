import { login } from "../../actions/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#EEF1F8] flex flex-col">
      {/* ログイン画面用シンプルヘッダー */}
      <header className="border-b-[3px] border-[#0017C1] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center gap-[14px]">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="18" cy="18" r="18" fill="#0017C1" />
            <path
              d="M18 7C11.925 7 7 11.925 7 18s4.925 11 11 11 11-4.925 11-11S24.075 7 18 7zm0 20c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"
              fill="white"
            />
            <circle cx="18" cy="18" r="3.5" fill="white" />
          </svg>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              データマネジメントポータル
            </h1>
            <p className="text-xs text-gray-500">Data Management Portal</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-[12px] shadow-sm p-10 w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            ログイン
          </h2>

          <form action={login} className="space-y-6">
            {/* ログインID */}
            <div className="flex flex-col gap-2">
              <label htmlFor="loginId" className="font-bold text-gray-900">
                ログインID
                <span className="ml-2 text-xs font-normal text-red-600 bg-red-50 border border-red-200 px-1 py-0.5 rounded">
                  ※必須
                </span>
              </label>
              <input
                id="loginId"
                name="loginId"
                type="text"
                required
                className="w-full rounded-[8px] border border-gray-400 bg-white px-4 h-14 text-base text-gray-900 hover:border-black focus:outline focus:outline-4 focus:outline-black focus:outline-offset-[2px] focus:ring-[2px] focus:ring-yellow-300"
                placeholder="IDを入力"
              />
            </div>

            {/* パスワード */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-bold text-gray-900">
                パスワード
                <span className="ml-2 text-xs font-normal text-red-600 bg-red-50 border border-red-200 px-1 py-0.5 rounded">
                  ※必須
                </span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-[8px] border border-gray-400 bg-white px-4 h-14 text-base text-gray-900 hover:border-black focus:outline focus:outline-4 focus:outline-black focus:outline-offset-[2px] focus:ring-[2px] focus:ring-yellow-300"
                placeholder="パスワードを入力"
              />
            </div>

            {/* ログインボタン */}
            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center min-h-[56px] rounded-[8px] border-4 border-double border-transparent bg-[#0017C1] text-white px-4 py-3 text-base font-bold underline-offset-[3px] transition-colors hover:bg-blue-900 hover:underline active:bg-blue-950 active:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[2px] focus-visible:ring-[2px] focus-visible:ring-yellow-300"
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
