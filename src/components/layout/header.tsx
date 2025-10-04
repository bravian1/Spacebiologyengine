import { LogoIcon } from '@/components/icons/logo-icon';
import Link from 'next/link';

export function Header({
    children
}: {
    children?: React.ReactNode;
}) {
  return (
    <header className="flex h-16 items-center gap-3 border-b bg-card/50 backdrop-blur-sm px-6 shrink-0 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-3">
        <LogoIcon className="h-7 w-7 text-accent" />
        <h1 className="font-headline text-2xl font-bold tracking-tight text-foreground">
          AstroBioChat
        </h1>
      </Link>
      {children}
    </header>
  );
}
