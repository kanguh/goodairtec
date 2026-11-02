type Props = { eyebrow: string; title: string; description?: string; center?: boolean };

export default function SectionTitle({ eyebrow, title, description, center }: Props) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-sm font-bold tracking-wide text-brand">{eyebrow}</p>
      <h2 className="mt-3 text-3xl leading-tight font-black tracking-tight text-navy md:text-4xl">{title}</h2>
      {description && <p className="mt-4 leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
