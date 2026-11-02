import SectionTitle from "./SectionTitle";

const points = [
  { title: "전문 기사 직접 시공", body: "하청 없이 경력 기사가 처음부터 끝까지 직접 설치합니다." },
  { title: "정품 자재 사용", body: "정품 동배관과 보온재를 사용하고, 사용 자재를 작업 후 안내해 드립니다." },
  { title: "작업 전 비용 확정", body: "추가 배관, 타공 등 추가 비용은 작업 시작 전에 먼저 설명드립니다." },
  { title: "설치 후 무상 A/S", body: "설치 불량으로 인한 문제는 기간 내 무상으로 다시 방문합니다." },
];

export default function WhyUs() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 md:px-6 lg:grid-cols-[1fr_1.4fr]">
        <SectionTitle
          eyebrow="WHY US"
          title="믿고 맡길 수 있는 이유"
          description="설치는 한 번이지만 사용은 10년입니다. 눈에 보이지 않는 배관과 마감까지 꼼꼼하게 시공합니다."
        />
        <ul className="grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2">
          {points.map((p, i) => (
            <li key={p.title} className="bg-white p-7">
              <span className="text-sm font-black text-brand">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-bold text-navy">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
