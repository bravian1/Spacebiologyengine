'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { motion } from 'framer-motion';
import { Rocket, Dna, Database, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header>
        <div className="flex items-center gap-4 ml-auto">
          <Button asChild variant="ghost">
            <Link href="/chat">Chat</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/search">Search</Link>
          </Button>
          <Button asChild>
            <Link href="/about">About</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </Header>
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter mb-4">
              About AstroBioChat
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Unveiling the technology and data behind our space biology knowledge engine.
            </p>
          </motion.div>

          <div className="space-y-10">
            <InfoSection
              icon={<Database className="w-8 h-8 text-primary" />}
              title="The Data Source: NASA's OSDR"
              description="AstroBioChat is built upon the NASA Open Science Data Repository (OSDR). This incredible resource provides open access to data from spaceflight and space-relevant ground studies, covering a wide range of biological research. We interact with the OSDR's public APIs to fetch study metadata, file lists, and search results in real-time."
            />

            <InfoSection
              icon={<Dna className="w-8 h-8 text-primary" />}
              title="The Brains: Generative AI"
              description="The 'chat' in AstroBioChat comes from powerful generative AI models (via Genkit). When you ask a question, we don't just do a simple keyword search. The AI model analyzes your query, understands its intent, and formulates a comprehensive answer. It also generates concise summaries for complex study metadata, making dense scientific information easier to digest."
            />

            <InfoSection
              icon={<Rocket className="w-8 h-8 text-primary" />}
              title="How It Works: The Flow"
              description={
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li><strong>You Ask:</strong> You enter a question into the chat or use the search page.</li>
                  <li><strong>Dual-Action Query:</strong> The app sends your query to our backend which simultaneously queries the NASA OSDR API for relevant studies and prompts a generative AI model to formulate an answer.</li>
                  <li><strong>AI-Powered Summary:</strong> When you select a study, another AI flow is triggered to read the dense metadata and generate a clear, concise summary of the study's objectives, methods, and key details.</li>
                  <li><strong>Data Visualization:</strong> Key data points, like file types and personnel roles, are turned into interactive charts to give you an at-a-glance overview of the study.</li>
                  <li><strong>Direct Access:</strong> All underlying data files are made available for you to download directly, providing a seamless link from insight to raw data.</li>
                </ol>
              }
            />

             <InfoSection
              icon={<BookOpen className="w-8 h-8 text-primary" />}
              title="Our Mission"
              description="Our goal is to make the wealth of knowledge within NASA's open science archives more accessible and intuitive. By combining a powerful data source with cutting-edge AI, we hope to empower researchers, students, and space enthusiasts to make new discoveries and gain a deeper understanding of life in space."
            />
          </div>
        </div>
      </main>
       <footer className="p-6 text-center text-muted-foreground text-sm">
        AstroBioChat | Your Gateway to Space Biology
      </footer>
    </div>
  );
}


function InfoSection({ icon, title, description }: { icon: React.ReactNode, title: string, description: string | React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-6"
        >
            <div className="bg-primary/10 p-4 rounded-full mt-1">
                {icon}
            </div>
            <div>
                <h2 className="text-2xl font-bold font-headline mb-2">{title}</h2>
                <div className="text-muted-foreground text-base">{description}</div>
            </div>
        </motion.div>
    )
}
