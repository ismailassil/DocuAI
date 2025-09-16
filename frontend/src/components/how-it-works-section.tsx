import { Card, CardContent } from "@/components/ui/card"
import { Upload, Cpu, Download } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Upload Documents",
    description: "Send documents via API or drag-and-drop interface. Support for 50+ file formats.",
  },
  {
    icon: Cpu,
    title: "AI Processing",
    description: "Our advanced AI models analyze, extract, and understand your document content.",
  },
  {
    icon: Download,
    title: "Get Insights",
    description: "Receive structured data, search results, and actionable insights in JSON format.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How DocuAI Works</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Three simple steps to transform your documents into intelligent, searchable data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-border bg-background text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">{step.title}</h3>
                  <p className="text-foreground/70">{step.description}</p>
                </CardContent>
              </Card>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
