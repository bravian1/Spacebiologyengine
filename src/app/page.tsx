'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { motion } from 'framer-motion';
import { Rocket, Telescope, BrainCircuit } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/40">
      <Header>
        <div className="flex items-center gap-4 ml-auto">
          <Button asChild variant="ghost">
            <Link href="/chat">Chat</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/search">Search</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/about">About</Link>
          </Button>
        </div>
      </Header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium mb-4">
            Powered by NASA Open Science Data & Generative AI
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter mb-4 text-foreground">
            Explore the Cosmos of Biology
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            AstroBioChat is your intelligent gateway to the vast universe of space biology research. Ask questions, search studies, and uncover insights from NASA's Open Science Data Repository.
          </p>
          <Button asChild size="lg" className="rounded-full text-lg px-8 py-6">
            <Link href="/chat">
              <Rocket className="mr-2 h-5 w-5" />
              Start Exploring
            </Link>
          </Button>
        </motion.div>

        <motion.div 
            className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full"
            initial="hidden"
            animate="visible"
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
      </main>
      <footer className="p-6 text-center text-muted-foreground text-sm">
        A project exploring the potential of generative AI with public scientific data.
      </footer>
    </div>
  );
}

const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div className="bg-card p-6 rounded-xl shadow-lg border border-transparent hover:border-primary/50 transition-all" variants={featureVariants}>
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-bold font-headline mb-2">{title}</h3>
            <p className="text-muted-foreground text-left">{description}</p>
        </motion.div>
    )
}