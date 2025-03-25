import Link from 'next/link'

export const metadata = {
  title: 'Вход в аккаунт | Платформа Хакатонов',
  description: 'Войдите в свой аккаунт на платформе хакатонов',
}

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Вход в аккаунт</h1>
          <p className="text-gray-600">
            Войдите, чтобы участвовать в хакатонах
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Электронная почта
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="!mt-2">
              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Войти
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Нет аккаунта?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
} 