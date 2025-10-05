'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Header, Navigation } from '@/components/layout/header';
import { motion } from 'framer-motion';
import { Rocket, Telescope, BrainCircuit } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header>
        <Navigation />
      </Header>
      
      <main className="flex-1">
        <section className="relative min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 text-center text-white">
          {heroImage && (
             <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                data-ai-hint={heroImage.imageHint}
                fill
                className="object-cover"
                priority
            />
          )}
          <div className="absolute inset-0 bg-background/70 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          <motion.div
            className="relative z-10 max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-headline tracking-tighter mb-6">
              Explore the Universe of Space Biology
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-foreground/80 mb-10">
              AstroBioChat is your intelligent gateway to NASA's Open Science Data Repository. Ask questions, search studies, and uncover AI-powered insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <Button asChild size="lg" className="rounded-full text-lg px-8 py-6 bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105">
                <Link href="/chat">
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Chatting
                </Link>
              </Button>
               <Button asChild size="lg" variant="outline" className="rounded-full text-lg px-8 py-6 bg-white/5 backdrop-blur-sm border-primary/50 text-foreground shadow-lg transition-transform hover:scale-105 hover:bg-white/10">
                <Link href="/search">
                    <Telescope className="mr-2 h-5 w-5" />
                    Search Studies
                </Link>
               </Button>
            </div>
          </motion.div>
        </section>

        <section className="py-20 sm:py-28 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="mx-auto max-w-3xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Key Features</h2>
                    <p className="mt-4 text-lg text-muted-foreground">AstroBioChat offers a range of features designed to enhance your research experience.</p>
                </div>
                <motion.div 
                    className="grid md:grid-cols-3 gap-8 max-w-6xl w-full mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                >
                    <FeatureCard
                        icon={<Telescope className="w-10 h-10 text-accent" />}
                        title="Search & Discover"
                        description="Dive into a comprehensive database of NASA's space biology studies. Use powerful search and filtering tools to find the exact data you need."
                    />
                    <FeatureCard
                        icon={<BrainCircuit className="w-10 h-10 text-accent" />}
                        title="AI-Powered Insights"
                        description="Go beyond raw data. Ask complex questions in natural language and receive AI-generated summaries and insights based on the repository's content."
                    />
                    <FeatureCard
                        icon={<Rocket className="w-10 h-10 text-accent" />}
                        title="Accelerate Research"
                        description="Quickly find relevant experiments, analyze study details with generated summaries, and download raw data to fuel your own scientific journey."
                    />
                </motion.div>
            </div>
        </section>
      </main>

      <footer className="border-t border-primary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground text-sm">
            <p>© 2024 AstroBioChat. A project exploring the potential of generative AI with public scientific data.</p>
        </div>
      </footer>
    </div>
  );
}

const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div className="flex flex-col gap-4 rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm" variants={featureVariants}>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
            </div>
            <h3 className="text-xl font-bold font-headline">{title}</h3>
            <p className="text-base text-muted-foreground">{description}</p>
        </motion.div>
    )
}
