interface ArticleContentProps {
  content: string;
}

const renderContent = (content: string): React.ReactNode[] => {
  const lines = content.split("\n");

  return lines.map((line, i) => {
    if (line.startsWith("## ")) {
      return (
            <p key={i} className="text-sm sm:text-base font-bold mt-10 leading-relaxed mb-3">
          {line.replace("## ", "")}
        </p>
      );
    }

    if (line.trim() === "") return <br key={i} />;

    return (
      <p key={i} className="text-base leading-relaxed mb-3">
        {line}
      </p>
    );
  });
};

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="mb-10 w-full max-w-none prose prose-sm sm:prose lg:prose-lg">
      {renderContent(content)}
    </div>
  );
}