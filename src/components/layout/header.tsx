import { LogoIcon } from '@/components/icons/logo-icon';

export function Header() {
  return (
    <header className="flex h-16 items-center gap-3 border-b bg-card px-6 shrink-0">
      <LogoIcon className="h-7 w-7 text-accent" />
      <h1 className="font-headline text-2xl font-bold tracking-tight text-foreground">
        AstroBioChat
      </h1>
    </header>
  );
}
