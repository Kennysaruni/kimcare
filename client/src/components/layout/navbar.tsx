// Navigation bar component for the KIMCARE mental health platform
// Provides main navigation links and donation button
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logo from '../../assets/logo.jpeg'

export default function Navbar() {
  return (
    // Main navigation wrapper with blur effect and border
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Organization logo/name with link to homepage */}
        <Link href="/">
          <a className="mr-8 flex items-center space-x-2">
            <img 
              src={logo} 
              alt="KIMCARE Logo" 
              className="h-14 w-auto"
            />
          </a>
        </Link>

        {/* Navigation links and donation button container */}
        <div className="flex items-center justify-between flex-1">
          {/* Main navigation links */}
          <div className="flex gap-6 md:gap-10">
            <Link href="/resources">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                Resources
              </a>
            </Link>
            <Link href="/volunteer">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                Volunteer
              </a>
            </Link>
            <Link href="/partners">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                Partners
              </a>
            </Link>
            {/* <Link href="/admin/content">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                Manage Content
              </a>
            </Link> */}
          </div>

          {/* Prominent donation button */}
          <Link href="/donate">
            <Button variant="default">Donate Now</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}