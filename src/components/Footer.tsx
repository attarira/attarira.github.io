"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-muted-foreground w-48">
          © {year} Rayaan Attari
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/attarira"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/attarira"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href="mailto:rayaan.attari@gmail.com"
            className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
            aria-label="Email"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
