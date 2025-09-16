import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO, TechFlow",
    content: "DocuAI transformed our document processing workflow. What used to take hours now happens in seconds.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Lead Developer, DataCorp",
    content: "The API is incredibly well-designed. Integration was seamless and the results are consistently accurate.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Product Manager, InnovateLab",
    content:
      "Outstanding support and documentation. DocuAI helped us launch our document intelligence feature in record time.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Trusted by Developers Worldwide</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">See what teams are saying about DocuAI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border bg-background">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-card-foreground mb-4 text-pretty">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-foreground/70">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
