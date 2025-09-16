import { Search } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-lg">
                <Search className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-card-foreground">DocuAI</span>
            </div>
            <p className="text-foreground/70 max-w-md">
              Transform your documents into actionable insights with our AI-powered document search and analysis API.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-foreground/70 hover:text-card-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-card-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-card-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-card-foreground transition-colors">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-foreground/70 hover:text-card-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-card-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-card-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-card-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-foreground/70">© 2024 DocuAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
