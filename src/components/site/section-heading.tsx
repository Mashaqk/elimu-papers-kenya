export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  const cn = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${cn}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
      )}
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
