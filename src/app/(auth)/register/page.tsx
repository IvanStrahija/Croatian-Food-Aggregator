export default function RegisterPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Create an account</h1>
      <form className="max-w-md space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Name</span>
          <input
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            type="text"
            name="name"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            type="email"
            name="email"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <input
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            type="password"
            name="password"
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-orange-500 px-4 py-2 text-white"
        >
          Sign up
        </button>
      </form>
    </main>
  )
}
