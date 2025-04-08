import Link from "next/link";

export function FooterSection() {
  return (
    <footer className="py-12 px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
            FlowCraft AI
          </h2>
          <p className="text-gray-400 mt-2">Transforming UX design with AI</p>
        </div>
        <div className="flex gap-8">
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Documentation
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>© 2024 FlowCraft AI. All rights reserved.</p>
      </div>
    </footer>
  );
} 