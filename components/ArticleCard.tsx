"use client";
import React from "react";
import { ArrowRight, Clock, Eye, Heart } from "lucide-react";
import Image from "next/image";
import Card from "./Card";
import Badge from "./Badge";
import Button from "./Button";

interface ArticleCardProps {
  title:        string;
  excerpt:      string;
  cover_image:  string;
  author_id:    number;
  category_id:  number;
  category_name?: string;  // nom venant de l'API
  category_emoji?: string; // emoji venant de l'API
  tags?:        string[];
  published_at: string;
  read_time:    number;
  likes:        number;
  views:        number;
  isfeatured?:  boolean;
}

const ArticleCard = ({
  title, excerpt, cover_image,
  category_name, category_emoji,
  tags = [], read_time, likes, views, isfeatured,
}: ArticleCardProps) => {

  const categoryLabel = category_name
    ? `${category_emoji ?? "📁"} ${category_name}`
    : null;

  if (isfeatured) {
    return (
      <Card horizontal className="group cursor-pointer overflow-hidden">
        <figure className="lg:w-1/2 overflow-hidden">
          <Image src={cover_image} alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            width={600} height={400} />
        </figure>
        <div className="card-body lg:w-1/2 justify-center space-y-3">
          <Badge variant="secondary">⭐ À la une</Badge>
          {categoryLabel && <Badge>{categoryLabel}</Badge>}
          <h2 className="card-title text-2xl">{title}</h2>
          <p className="text-base-content/70">{excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-base-content/60">
            <span className="flex items-center gap-1"><Clock size={14} /> {read_time} min</span>
            <span className="flex items-center gap-1"><Heart size={14} /> {likes}</span>
            <span className="flex items-center gap-1"><Eye size={14} /> {views}</span>
          </div>
          <Button variant="ghost">Lire l&apos;article <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group cursor-pointer overflow-hidden">
      <figure className="overflow-hidden">
        <Image src={cover_image} alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          width={400} height={250} />
      </figure>
      <div className="card-body space-y-3">
        {categoryLabel && <Badge>{categoryLabel}</Badge>}
        <h2 className="card-title">{title}</h2>
        <p className="text-sm text-base-content/70">{excerpt}</p>
        <div className="flex gap-1 flex-wrap">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline">#{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-base-content/60 pt-2">
          <span className="flex items-center gap-1"><Clock size={14} /> {read_time} min</span>
          <div className="flex gap-3">
            <span className="flex items-center gap-1"><Heart size={14} /> {likes}</span>
            <span className="flex items-center gap-1"><Eye size={14} /> {views}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;