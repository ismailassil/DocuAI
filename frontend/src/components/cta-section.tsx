import { Button } from "@/components/ui/button"
import { ArrowRight, Code } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Ready to Transform Your Documents?</h2>
          <p className="text-lg text-foreground/70 mb-8">
            Join thousands of developers who trust DocuAI for their document intelligence needs. Start your free trial
            today and see the difference AI can make.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-border bg-transparent">
              <Code className="mr-2 h-4 w-4" />
              View Documentation
            </Button>
          </div>

          <p className="text-sm text-foreground/70 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
