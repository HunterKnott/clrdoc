import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col gap-6 items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row md:gap-12">
        <div className="flex flex-col gap-4 w-80">
          <h1 className="font-bold md:text-3xl sm:text-3xl text-2xl">Authentication</h1>
          <p>Opening opportunities for healthcare providers to do a world of good </p>
        </div>
        <form className="flex flex-col gap-4 max-w-lg bg-white py-10 px-5 m-auto w-full mt-10">
          <div className="flex flex-col md:flex-row gap-4 max-w-xl m-auto">
            <div className="">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                name="email"
                type="email"
                className="border-gray-400 border-2 rounded p-3 md:text-xl w-full"
                required
              />
            </div>
            <div className="">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                className="border-gray-400 border-2 rounded p-3 md:text-xl w-full"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="bg-blue-500 w-full rounded-md font-medium text-gray-200 py-3 hover:bg-blue-600 transition duration-300"
              formAction={signup}
            >
              Sign Up
            </button>
            <button
              className="bg-blue-500 w-full rounded-md font-medium text-gray-200 py-3 hover:bg-blue-600 transition duration-300"
              formAction={login}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}