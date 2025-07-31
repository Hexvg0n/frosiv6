import Link from "next/link"

export const SiteFooter = () => (
  <footer className="border-t border-gray-800/50 mt-20">
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
      <p>&copy; {new Date().getFullYear()} FrosiReps. All rights reserved.</p>
      <div className="flex space-x-4 mt-4 md:mt-0">
        <Link href="#" className="hover:text-white transition-colors">
          Privacy Policy
        </Link>
        <Link href="#" className="hover:text-white transition-colors">
          Terms of Service
        </Link>
      </div>
    </div>
  </footer>
)
