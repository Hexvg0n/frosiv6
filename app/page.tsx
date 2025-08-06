"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Rocket } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import Link from "next/link"
import { ShoppingCart, Camera, LinkIcon, PackageSearch } from "lucide-react"

const HeroSection = () => (
  <section className="relative container mx-auto flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)] px-4">
    <AnimatedSection>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-4">
        Jedyna Platforma W2C 
      </h1>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-4">
        Której Potrzebowałeś 
      </h1>
      <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-8">
        Frosireps to najstarsze polskie community, które spopularyzowało temat replik w Polsce i odkryło do dziś najlepszego agenta, czyli KakoBuy. Dokładamy wszelkich starań, abyś doznał jak najlepszych wrażeń i jakości podczas zamawiania z Chin.
      </p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="lg"
          className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-8 py-6 text-lg font-semibold shadow-[0_0_20px_theme(colors.purple.600)] transition-shadow hover:shadow-[0_0_30px_theme(colors.purple.500)]"
        >
          <Rocket className="mr-2 h-5 w-5" />
          Zacznij już dziś
        </Button>
      </motion.div>
    </AnimatedSection>
  </section>
)

const tools = [
  {
    title: "W2C",
    description: "Przeglądaj listę najlepiej wyselekcjonowanych produktów.",
    href: "/w2c",
    icon: ShoppingCart,
  },
  {
    title: "QC Finder",
    description: "Sprawdzaj jakość itemów przed ich kupieniem.",
    href: "/qc-finder",
    icon: Camera,
  },
  {
    title: "Link Converter",
    description: "Przekonweruj każdy link na agenta który ci odpowiada.",
    href: "/converter",
    icon: LinkIcon,
  },
  {
    title: "Tracking Paczek",
    description: "Śledź statusy swoich paczek bez opóźnień.",
    href: "/tracking",
    icon: PackageSearch,
  },
]

const FeaturedToolsSection = () => (
  <section id="tools" className="py-20">
    <AnimatedSection>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-2 text-white">Wyróźnione Narzędzia</h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Wszystko czego potrzebujesz w jendym miejscu.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <Link href={tool.href} key={tool.title} className="block group">
              <Card className="bg-gray-900/40 border-gray-800/60 backdrop-blur-sm h-full transition-all duration-300 group-hover:border-purple-500/70 group-hover:shadow-2xl group-hover:shadow-purple-600/10 group-hover:-translate-y-2">
                <CardContent className="p-8 flex flex-col items-start">
                  <div className="p-3 bg-purple-600/20 rounded-lg mb-4 border border-purple-500/30">
                    <tool.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-gray-400 flex-grow">{tool.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  </section>
)

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedToolsSection />
    </>
  )
}
