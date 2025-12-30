import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">Admin Login</h1>
        <p className="mb-8 text-gray-600">
          Input your username and password to login.
        </p>
        <div className="space-x-4">
          <Link 
            href="/login" 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 font-medium transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
