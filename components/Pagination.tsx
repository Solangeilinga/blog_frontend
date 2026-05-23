import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage:  number;
  totalPages:   number;
  total:        number;
  basePath?:    string;
}

export default function Pagination({
  currentPage, totalPages, total, basePath = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return start + i;
  }).filter((p) => p >= 1 && p <= totalPages);

  return (
    <div className="flex flex-col items-center gap-3 mt-10">
      <p className="text-sm text-base-content/60">
        {total} article{total > 1 ? "s" : ""} au total
      </p>
      <div className="join">
        {currentPage > 1 && (
          <Link href={`${basePath}?page=${currentPage - 1}`} className="join-item btn btn-sm">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}

        {pages.map((p) => (
          <Link
            key={p}
            href={`${basePath}?page=${p}`}
            className={`join-item btn btn-sm ${p === currentPage ? "btn-primary" : ""}`}
          >
            {p}
          </Link>
        ))}

        {currentPage < totalPages && (
          <Link href={`${basePath}?page=${currentPage + 1}`} className="join-item btn btn-sm">
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
