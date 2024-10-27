import { SignedIn } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
  <main className="flex flex-col gap-8 items-center">
    <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight text-black mb-4">
      QL Company
    </h1>
    <p className="text-lg sm:text-2xl text-gray-700">
      Welcome to QL Company, where we innovate for a better tomorrow.
    </p>
    <SignedIn>
    <div className="flex gap-4 items-center flex-col sm:flex-row mt-6">
      <a
        className="flex rounded-full shadow-lg transition-transform transform hover:scale-105 bg-green-500 text-white font-semibold hover:bg-green-700 text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 justify-center items-center"
        href="/todolist"
        target="_blank"
        rel="noopener noreferrer"
      >To Do
      </a>
    </div>
    </SignedIn>
  </main>

  <footer className="mt-10 text-gray-600 text-sm sm:text-base">
    <p>® QL Company 2024. All rights reserved.</p>
  </footer>
</div>

  );
}
