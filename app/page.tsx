import Link from "next/link";
import { ArrowUpRight, Cpu, CircuitBoard, ShieldCheck, Zap, Network, Settings2, Factory, ChevronRight, Activity, RadioTower, Layers3, Gauge, Menu } from "lucide-react";

const solutions = [
  { icon: CircuitBoard, no: "01", title: "Үйлдвэрлэлийн автоматжуулалт", desc: "Танай үйл ажиллагаанд нийцсэн ухаалаг удирдлагын систем, PLC программчлал болон үйлдвэрлэлийн процессын автоматжуулалт." },
  { icon: Zap, no: "02", title: "Цахилгааны инженерчлэл", desc: "Худалдаа, үйлчилгээ болон үйлдвэрлэлийн объектод зориулсан найдвартай цахилгааны зураг төсөл, угсралт, ашиглалтад оруулалт." },
  { icon: ShieldCheck, no: "03", title: "Хамгаалалтын систем", desc: "Камерын хяналт, нэвтрэх эрхийн удирдлага, галын дохиолол болон барилгын хамгаалалтын нэгдсэн шийдэл." },
  { icon: Network, no: "04", title: "Ухаалаг барилга", desc: "Орчныг илүү аюулгүй, бүтээмжтэй, удирдахад хялбар болгох холбогдсон барилгын технологи." },
  { icon: Cpu, no: "05", title: "Программ хангамж ба IoT", desc: "Үйл ажиллагааны өгөгдлийг бодит мэдээлэл, шийдвэр болгон хувиргах захиалгат программ, хяналтын самбар болон IoT платформ." },
  { icon: Settings2, no: "06", title: "Системийн интеграц", desc: "Тоног төхөөрөмж, платформ болон ажлын урсгалыг нэг найдвартай экосистем болгон уялдуулна." },
];

export default function Нүүр хуудас() {
  return <main className="min-h-screen overflow-hidden bg-white text-[#101d32]">
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-[88px] max-w-[1320px] items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0c2b50] text-white"><Cpu size={23}/></span>
          <span className="text-[21px] font-extrabold tracking-[.11em] text-[#102b4b]">MOSFET<span className="text-[#00a6c7]">.</span></span>
        </Link>
        <nav className="hidden items-center gap-9 text-[13px] font-semibold text-[#52647a] md:flex">
          <a href="#home" className="transition hover:text-[#00a6c7]">Нүүр хуудас</a><a href="#about" className="transition hover:text-[#00a6c7]">Бидний тухай</a><a href="#solutions" className="transition hover:text-[#00a6c7]">Шийдлүүд</a><a href="#contact" className="transition hover:text-[#00a6c7]">Холбоо барих</a>
        </nav>
        <div className="flex items-center gap-3"><Link href="/login" className="hidden rounded-full border border-[#dce5ed] px-5 py-2.5 text-xs font-bold text-[#24405d] transition hover:border-[#00a6c7] sm:inline-flex">Харилцагчийн нэвтрэх</Link><a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-[#00a6c7] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:-translate-y-0.5 hover:bg-[#078ba9]">Холбоо барья <ArrowUpRight size={15}/></a></div>
      </div>
    </header>

    <section id="home" className="relative isolate min-h-[760px] overflow-hidden bg-[#071b32] pt-28 text-white lg:min-h-[790px]">
      <div className="absolute inset-0 -z-10" style={{backgroundImage:"radial-gradient(ellipse at 78% 45%,rgba(0,166,199,.23),transparent 36%),radial-gradient(ellipse at 15% 80%,rgba(23,73,124,.35),transparent 40%),linear-gradient(115deg,#071b32 0%,#0b2948 55%,#06172a 100%)"}}/>
      <div className="absolute inset-0 -z-10 opacity-[.13]" style={{backgroundImage:"linear-gradient(rgba(147,197,253,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(147,197,253,.3) 1px,transparent 1px)",backgroundSize:"54px 54px",maskImage:"linear-gradient(90deg,transparent,black 45%,black)"} }/>
      <div className="mx-auto grid min-h-[650px] max-w-[1320px] items-center gap-10 px-6 pb-20 pt-16 lg:grid-cols-[1.02fr_.98fr] lg:px-10">
        <div className="relative z-10 max-w-[650px]">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-300/25 bg-cyan-300/[.07] px-4 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-cyan-200"><span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]"/> Холбогдсон ирээдүйг инженерчилнэ</div>
          <h1 className="text-[48px] font-semibold leading-[1.08] tracking-[-.045em] sm:text-6xl lg:text-[72px]">Технологиор<br/> moves <span className="text-[#39c4df]">салбарыг</span><br/> урагшлуулна.</h1>
          <p className="mt-8 max-w-[510px] text-[15px] leading-8 text-slate-300">MOSFET нь үйлдвэрлэлийн автоматжуулалт, цахилгаан системээс эхлээд ухаалаг барилга, хамгаалалт болон захиалгат программ хангамж хүртэлх инженерчлэл, технологийн цогц шийдлийг санал болгодог.</p>
          <div className="mt-10 flex flex-wrap items-center gap-4"><a href="#solutions" className="inline-flex items-center gap-3 rounded-full bg-[#00a6c7] px-7 py-4 text-xs font-bold text-white shadow-xl shadow-cyan-950/30 transition hover:-translate-y-1 hover:bg-[#08b5d4]">Шийдлүүдтэй танилцах <ArrowUpRight size={16}/></a><a href="#about" className="inline-flex items-center gap-2 px-4 py-4 text-xs font-semibold text-slate-300 transition hover:text-white">MOSFET-ийн тухай <ChevronRight size={15}/></a></div>
          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-7 text-[10px] font-semibold uppercase tracking-[.17em] text-slate-400"><span>Инженерчлэл</span><span>Автоматжуулалт</span><span>Системийн интеграц</span><span>Технологи</span></div>
        </div>
        <div className="relative mx-auto flex aspect-square w-full max-w-[590px] items-center justify-center">
          <div className="absolute h-[82%] w-[82%] rounded-full border border-cyan-200/15"/><div className="absolute h-[65%] w-[65%] rounded-full border border-cyan-200/20"/><div className="absolute h-[48%] w-[48%] rounded-full border border-dashed border-cyan-200/30"/>
          <div className="absolute h-[70%] w-[70%] rounded-full bg-cyan-400/10 blur-3xl"/>
          <div className="relative grid h-[210px] w-[210px] place-items-center rounded-[42px] border border-cyan-100/25 bg-gradient-to-br from-[#164a70] to-[#09223c] shadow-[0_30px_100px_rgba(0,0,0,.4)] sm:h-[250px] sm:w-[250px]"><div className="absolute inset-4 rounded-[30px] border border-white/10"/><CircuitBoard size={104} strokeWidth={.8} className="text-cyan-200"/><span className="absolute bottom-7 text-[9px] font-bold tracking-[.35em] text-cyan-100/70">MOSFET СИСТЕМ</span></div>
          <div className="absolute left-[4%] top-[22%] flex items-center gap-3 rounded-2xl border border-white/10 bg-[#102e4b]/90 px-4 py-3 shadow-xl backdrop-blur"><Activity className="text-cyan-300" size={20}/><span className="text-[10px] font-semibold tracking-wide">Ухаалаг удирдлага</span></div>
          <div className="absolute right-[0%] top-[30%] flex items-center gap-3 rounded-2xl border border-white/10 bg-[#102e4b]/90 px-4 py-3 shadow-xl backdrop-blur"><RadioTower className="text-cyan-300" size={20}/><span className="text-[10px] font-semibold tracking-wide">Холболт</span></div>
          <div className="absolute bottom-[13%] left-[8%] flex items-center gap-3 rounded-2xl border border-white/10 bg-[#102e4b]/90 px-4 py-3 shadow-xl backdrop-blur"><Gauge className="text-cyan-300" size={20}/><span className="text-[10px] font-semibold tracking-wide">Бүтээмж</span></div>
          <div className="absolute bottom-[9%] right-[7%] flex items-center gap-3 rounded-2xl border border-white/10 bg-[#102e4b]/90 px-4 py-3 shadow-xl backdrop-blur"><Layers3 className="text-cyan-300" size={20}/><span className="text-[10px] font-semibold tracking-wide">Системийн интеграц</span></div>
          <span className="absolute right-[17%] top-[8%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#67e8f9]"/><span className="absolute bottom-[22%] left-[2%] h-1.5 w-1.5 rounded-full bg-cyan-300"/>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent"/>
    </section>

    <section id="about" className="relative py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-6 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:px-10">
        <div><p className="mb-5 text-[11px] font-bold uppercase tracking-[.24em] text-[#00a0bf]">Бид хэн бэ</p><h2 className="max-w-xl text-4xl font-semibold leading-[1.13] tracking-[-.04em] text-[#102b49] sm:text-5xl">Илүү ухаалаг систем бүтээж, <span className="text-[#00a6c7]">харилцан холбогдсон</span> ертөнцийг цогцлооно.</h2></div>
        <div className="border-l-2 border-[#00a6c7] pl-7"><p className="text-[16px] leading-8 text-[#607187]">Бид инженерийн мэдлэг, орчин үеийн технологийг нэгтгэн үйл ажиллагаанд тулгардаг бодит сорилтуудыг шийддэг. Найдвартай дэд бүтэц, оновчтой дизайн, саадгүй интеграцыг хослуулж, нэгдмэл байдлаар ажиллах шийдлийг бий болгоно.</p><a href="#contact" className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-[#078eaa]">Манай багтай хамтран ажиллах <ArrowUpRight size={15}/></a></div>
      </div>
      <div className="mx-auto mt-20 grid max-w-[1320px] grid-cols-2 border-y border-[#e6edf2] px-6 py-8 sm:grid-cols-4 lg:px-10">
        {[["01","Инженерийн шийдэлд суурилсан"],["02","Цогц шийдэл"],["03","Найдвартай хэрэгжилт"],["04","Урт хугацааны дэмжлэг"]].map(([n,t])=><div key={n} className="border-r border-[#e6edf2] px-4 py-3 last:border-0 sm:px-8"><p className="text-3xl font-semibold tracking-tight text-[#00a6c7]">{n}</p><p className="mt-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#68798d]">{t}</p></div>)}
      </div>
    </section>

    <section id="solutions" className="bg-[#f4f8fb] py-24 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <div className="mb-14 flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="mb-5 text-[11px] font-bold uppercase tracking-[.24em] text-[#00a0bf]">Бид юу хийдэг вэ</p><h2 className="max-w-2xl text-4xl font-semibold tracking-[-.04em] text-[#102b49] sm:text-5xl">Цогц шийдэл.<br/><span className="text-[#00a6c7]">Хэмжигдэхүйц үр дүн.</span></h2></div><p className="max-w-md text-sm leading-7 text-[#68798d]">Бид нэг системээс эхлээд технологийн бүрэн экосистем хүртэлх шийдлээр байгууллагын бүтээмж, аюулгүй байдал, үйл ажиллагааны хяналтыг сайжруулна.</p></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{solutions.map(({icon:Icon,no,title,desc})=><article key={no} className="group relative min-h-[270px] overflow-hidden rounded-2xl border border-[#e1eaf0] bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_22px_55px_rgba(13,52,82,.09)]"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#eaf8fb] text-[#009fbd] transition group-hover:bg-[#00a6c7] group-hover:text-white"><Icon size={23}/></span><span className="text-xs font-semibold tracking-[.15em] text-[#b5c4d0]">{no}</span></div><h3 className="mt-8 text-[19px] font-semibold text-[#183653]">{title}</h3><p className="mt-3 text-[13px] leading-7 text-[#718196]">{desc}</p><div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#00a6c7] transition-all duration-300 group-hover:w-full"/></article>)}</div>
      </div>
    </section>

    <section className="bg-[#0a2744] py-20 text-white"><div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-8 px-6 md:flex-row md:items-center lg:px-10"><div><p className="mb-4 text-[10px] font-bold uppercase tracking-[.24em] text-cyan-300">Нэгдсэн технологийн түнш</p><h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-.03em] sm:text-4xl">Технологи таны ажлыг илүү хялбар болгох ёстой.</h2></div><a href="#contact" className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-[#00a6c7] px-7 py-4 text-xs font-bold text-white transition hover:bg-[#08b5d4] md:self-auto">Хамтын ажиллагаагаа эхлүүлье <ArrowUpRight size={16}/></a></div></section>

    <section id="contact" className="py-24 lg:py-28"><div className="mx-auto grid max-w-[1320px] gap-12 px-6 lg:grid-cols-[1fr_.8fr] lg:px-10"><div><p className="mb-5 text-[11px] font-bold uppercase tracking-[.24em] text-[#00a0bf]">Бидэнтэй холбогдох</p><h2 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-[-.04em] text-[#102b49] sm:text-5xl">Илүү үр дүнтэй шийдлийг <span className="text-[#00a6c7]">хамтдаа бүтээцгээе.</span></h2><p className="mt-6 max-w-lg text-sm leading-7 text-[#68798d]">Төсөл, үйл ажиллагааны сорилт эсвэл технологийн зорилгынхоо талаар бидэнд мэдээлнэ үү. Манай баг танд тохирох шийдлийг тодорхойлоход тусална.</p></div><div className="rounded-2xl bg-[#f4f8fb] p-8 sm:p-10"><p className="text-sm font-semibold text-[#183653]">Эхлэхэд бэлэн үү?</p><p className="mt-3 text-sm leading-7 text-[#718196]">Инженерчлэл, автоматжуулалт, хамгаалалт эсвэл программ хангамжийн интеграцын хэрэгцээгээ MOSFET-тэй ярилцаарай.</p><a href="mailto:info@mosfet.mn" className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#00a6c7] px-7 py-4 text-xs font-bold text-white transition hover:bg-[#078ba9]">Манай багтай холбогдох <ArrowUpRight size={16}/></a></div></div></section>
    <footer className="bg-[#061a2e] text-white"><div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center lg:px-10"><Link href="/" className="text-lg font-extrabold tracking-[.12em]">MOSFET<span className="text-[#00a6c7]">.</span></Link><p className="text-xs text-slate-400">Инженерчлэл · Автоматжуулалт · Технологи</p><p className="text-[11px] text-slate-500">© {new Date().getFullYear()} MOSFET. Бүх эрх хуулиар хамгаалагдсан.</p></div></footer>
  </main>;
}
