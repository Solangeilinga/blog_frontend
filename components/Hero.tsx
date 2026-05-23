import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface HeroProps {
  backgroundImage?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  backHref?: string; 
}

const Hero = ({ backgroundImage, title, description, children, backHref }: HeroProps) => {
  return (
    <div
      className="hero min-h-[480px] bg-cover bg-center relative"
      style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="hero-content text-center relative z-10 px-4 py-16 max-w-3xl">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-white/80 leading-relaxed mb-6 max-w-xl mx-auto">
              {description}
            </p>
          )}
          {children && (
            <div className="flex gap-3 justify-center flex-wrap">{children}</div>
          )}

          
        </div>
        
      </div>
      {backHref && (
  <Link
    href={backHref}
    className="absolute bottom-6 left-6 z-10 inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
  >
    <ArrowLeft className="h-4 w-4" />
    Retour
  </Link>
)}
    </div>
  )
}

export default Hero