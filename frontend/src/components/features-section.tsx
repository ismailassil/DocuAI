import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileText, Brain, Zap } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Intelligent Search",
    description:
      "Semantic search across all document types with natural language queries and contextual understanding.",
  },
  {
    icon: FileText,
    title: "Multi-Format Support",
    description: "Process PDFs, Word docs, images, spreadsheets, and more with unified API endpoints.",
  },
  {
    icon: Brain,
    title: "AI-Powered Extraction",
    description: "Extract key information, entities, and insights using advanced machine learning models.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-second response times with optimized processing pipelines and global CDN.",
  },
  // {
  //   icon: Shield,
  //   title: "Enterprise Security",
  //   description: "Bank-grade encryption, SOC 2 compliance, and GDPR-ready data handling.",
  // },
  // {
  //   icon: Code,
  //   title: "Developer First",
  //   description: "RESTful APIs, comprehensive SDKs, and detailed documentation for rapid integration.",
  // },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Powerful Features for Modern Applications
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Everything you need to build intelligent document processing into your applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-background hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground/70">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
