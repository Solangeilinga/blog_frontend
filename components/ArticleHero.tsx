import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ArticleHeroProps {
  coverImage: string;
  title: string;
}

export default function ArticleHero({ coverImage, title }: ArticleHeroProps) {
  return (
    <div className="relative w-full h-[420px] overflow-hidden">
      <Image
        src={coverImage}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute bottom-6 left-6 text-white">
        <Link href="/" className="btn btn-sm btn-ghost text-white mb-4">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      </div>
    </div>
  );
}