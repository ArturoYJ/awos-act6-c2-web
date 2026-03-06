import Link from 'next/link';
import { Wand2, Globe, TrendingUp, ArrowRight } from 'lucide-react';

const sections = [
  {
    title: 'Generador de Imagenes',
    description: 'Crea imagenes unicas con inteligencia artificial a partir de texto',
    href: '/images',
    icon: Wand2,
    api: 'Hugging Face · FLUX.1',
    color: 'var(--accent)',
  },
  {
    title: 'Asteroides Cercanos',
    description: 'Explora los objetos cercanos a la Tierra detectados por la NASA',
    href: '/asteroids',
    icon: Globe,
    api: 'NASA NeoWs',
    color: '#5a9a6e',
  },
  {
    title: 'Mercado de Valores',
    description: 'Consulta precios diarios de acciones del mercado bursatil',
    href: '/stocks',
    icon: TrendingUp,
    api: 'Alpha Vantage',
    color: '#4a90d9',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-organic flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl animate-fade-up">
        
        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-xs tracking-widest text-(--muted) uppercase mb-4">
            Mini Practica de Arquitectura Orientada a Servicios
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-(--foreground) leading-tight">
            API Gateway
          </h1>
          <p className="mt-4 text-(--muted) text-lg max-w-md mx-auto leading-relaxed">
            Tres servicios, un solo punto de acceso. Explora datos del espacio, genera arte con IA y consulta el mercado financiero.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative overflow-hidden bg-(--surface) rounded-2xl border border-(--border) p-6 shadow-sm hover:shadow-md hover:border-(--accent-light) transition-all hover:scale-[1.02]"
            >
              {/* Watermark icon */}
              <section.icon
                className="absolute -right-4 -bottom-4 w-28 h-28 opacity-[0.04] pointer-events-none"
                style={{ color: section.color }}
              />
              <div className="flex items-center gap-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${section.color}15` }}
                >
                  <section.icon className="w-6 h-6" style={{ color: section.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-(--foreground) group-hover:text-(--accent) transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-sm text-(--muted) mt-0.5">{section.description}</p>
                  <span className="inline-block mt-2 text-[10px] tracking-wide uppercase text-(--muted) opacity-60">
                    {section.api}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-(--muted) group-hover:text-(--accent) group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-(--muted) mt-12 tracking-wide opacity-50">
          Express.js · Next.js · TypeScript · SOA
        </p>
      </div>
    </main>
  );
}
