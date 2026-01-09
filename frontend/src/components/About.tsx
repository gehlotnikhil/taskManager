export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold sm:text-5xl">
          About Note Manager
        </h1>

        <p className="mt-6 text-lg text-gray-300">
          Note Manager is a simple and efficient application designed to help
          you organize your daily work, track notes, and stay productive.
        </p>

        <div className="mt-10 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400">
              Why this app?
            </h2>
            <p className="mt-2 text-gray-300">
              Most note tools are overloaded with features. This app focuses on
              the essentials — creating notes, adding descriptions, and viewing
              them in a clean, sorted way.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-indigo-400">
              What can you do?
            </h2>
            <ul className="mt-2 list-disc list-inside text-gray-300 space-y-1">
              <li>Create notes with title and description</li>
              <li>View notes sorted by latest date</li>
              <li>Manage your work in a distraction-free UI</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-indigo-400">
              Built with
            </h2>
            <p className="mt-2 text-gray-300">
              React, TypeScript, Tailwind CSS, and a secure backend powered by
              JWT authentication.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
