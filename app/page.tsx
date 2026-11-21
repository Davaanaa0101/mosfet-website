"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight, Cpu, CircuitBoard, ShieldCheck, Zap, Network, Settings2,
  ChevronRight, Activity, RadioTower, Layers3, Gauge, Menu, X, CheckCircle2,
  MoveUpRight, Sparkles, Mail, MapPin, Plus, Minus
} from "lucide-react";

const solutions = [
  { icon: CircuitBoard, no: "01", title: "Үйлдвэрлэлийн автоматжуулалт", short: "Ухаалаг удирдлага, PLC программчлал, үйлдвэрлэлийн процессын автоматжуулалт.", detail: "Үйлдвэрлэлийн шугамын автомат удирдлага, PLC/HMI программчлал, SCADA хяналт болон тоног төхөөрөмжийн интеграцыг нэг шийдэл болгон хэрэгжүүлнэ.", tags: ["PLC / HMI", "SCADA", "Процессын удирдлага"] },
  { icon: Zap, no: "02", title: "Цахилгааны инженерчлэл", short: "Найдвартай цахилгаан хангамж, зураг төсөл, угсралт, ашиглалтад оруулалт.", detail: "Барилга, үйлдвэр, худалдаа үйлчилгээний объектод цахилгаан хангамжийн зураг төсөл, самбарын шийдэл, угсралт, туршилт тохируулга хийнэ.", tags: ["Зураг төсөл", "Самбар угсралт", "Туршилт"] },
  { icon: ShieldCheck, no: "03", title: "Хамгаалалтын систем", short: "Камер, нэвтрэх эрхийн удирдлага, галын дохиоллын нэгдсэн шийдэл.", detail: "CCTV, access control, галын дохиолол болон аюулгүй байдлын дэд системүүдийг нэгдсэн удирдлага, хяналттайгаар холбож өгнө.", tags: ["CCTV", "Access control", "Галын дохиолол"] },
  { icon: Network, no: "04", title: "Ухаалаг барилга", short: "Барилгын орчныг аюулгүй, эрчим хүчний хэмнэлттэй, удирдахад хялбар болгоно.", detail: "Гэрэлтүүлэг, HVAC, сүүдрэвч, эрчим хүчний хэрэглээ болон өрөөний автоматжуулалтыг нэг системээс удирдах боломж бүрдүүлнэ.", tags: ["BMS", "HVAC", "Эрчим хүч"] },
  { icon: Cpu, no: "05", title: "Программ хангамж ба IoT", short: "Захиалгат программ, хяналтын самбар, IoT платформ болон өгөгдлийн шийдэл.", detail: "Төхөөрөмжөөс өгөгдөл цуглуулах, бодит цагийн хяналт, тайлан аналитик болон байгууллагын хэрэгцээнд нийцсэн веб систем хөгжүүлнэ.", tags: ["IoT", "Dashboard", "Интеграц API"] },
  { icon: Settings2, no: "06", title: "Системийн интеграц", short: "Тоног төхөөрөмж, платформ, ажлын урсгалыг нэг экосистем болгон уялдуулна.", detail: "Өөр өөр үйлдвэрлэгчийн төхөөрөмж, протокол, программ хангамжийг нэгтгэж, тогтвортой харилцан ажиллагаа болон төвлөрсөн удирдлагыг бий болгоно.", tags: ["Modbus", "BACnet", "Control систем"] },
];

const capabilities = ["Инженерчлэл", "Автоматжуулалт", "Системийн интеграц", "Дижитал шилжилт"];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const sections = ["home", "about", "solutions", "contact"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveNav(entry.target.id);
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));
    return () => { observer.disconnect(); revealObserver.disconnect(); };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="mosfet-site min-h-screen overflow-hidden bg-[#07182b] text-white">
      <header className="site-header fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-[82px] max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="brand-lockup flex items-center gap-3" onClick={closeMenu}>
            <span className="brand-icon grid h-10 w-10 place-items-center rounded-xl"><Cpu size={22}/></span>
            <span className="text-[20px] font-extrabold tracking-[.12em]">MOSFET<span className="text-cyan-300">.</span></span>
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            {[ ["home","Нүүр хуудас"], ["about","Бидний тухай"], ["solutions","Шийдлүүд"], ["contact","Холбоо барих"] ].map(([id,label]) => (
              <a key={id} href={`#${id}`} className={`nav-link ${activeNav === id ? "nav-active" : ""}`}>{label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <Link href="/login" className="header-login">Харилцагчийн нэвтрэх</Link>
            <a href="#contact" className="button-primary">Холбоо барья <ArrowUpRight size={15}/></a>
          </div>
          <button type="button" aria-label={menuOpen ? "Цэс хаах" : "Цэс нээх"} className="mobile-menu-button lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        </div>
        {menuOpen && <div className="mobile-menu lg:hidden">
          {[ ["home","Нүүр хуудас"], ["about","Бидний тухай"], ["solutions","Шийдлүүд"], ["contact","Холбоо барих"] ].map(([id,label]) => <a key={id} href={`#${id}`} onClick={closeMenu}>{label}<ArrowUpRight size={15}/></a>)}
          <Link href="/login" onClick={closeMenu}>Харилцагчийн нэвтрэх <ArrowUpRight size={15}/></Link>
        </div>}
      </header>

      <section id="home" className="hero-section relative isolate min-h-[780px] overflow-hidden pt-28 lg:min-h-[850px]">
        <div className="hero-grid absolute inset-0 -z-10"/>
        <div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/>
        <div className="mx-auto grid min-h-[690px] max-w-[1380px] items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.03fr_.97fr] lg:px-12">
          <div className="hero-copy relative z-10">
            <div className="eyebrow-pill mb-8"><span className="live-dot"/> ИНЖЕНЕРЧЛЭЛ · АВТОМАТЖУУЛАЛТ · ТЕХНОЛОГИ</div>
            <h1 className="hero-title">Ирээдүйн системийг<br/> <span>өнөөдөр</span> бүтээнэ.</h1>
            <p className="mt-8 max-w-[560px] text-[15px] leading-8 text-slate-300 sm:text-base">MOSFET нь үйлдвэрлэлийн автоматжуулалт, цахилгаан систем, ухаалаг барилга, хамгаалалт болон программ хангамжийн цогц инженерийн шийдлийг санал болгодог.</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#solutions" className="button-primary button-large">Шийдлүүдтэй танилцах <ArrowUpRight size={17}/></a>
              <a href="#about" className="button-ghost">Бидний тухай <ChevronRight size={16}/></a>
            </div>
            <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-7">{capabilities.map((item) => <span key={item} className="capability-label">{item}</span>)}</div>
          </div>
          <div className="hero-visual relative mx-auto flex aspect-square w-full max-w-[600px] items-center justify-center">
            <div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="orbit orbit-c"/>
            <div className="orbit-node node-a"><Activity size={17}/></div><div className="orbit-node node-b"><RadioTower size={17}/></div><div className="orbit-node node-c"><Gauge size={17}/></div>
            <div className="hero-glass-core"><div className="core-inner"><CircuitBoard size={104} strokeWidth={1}/><span>MOSFET SYSTEMS</span></div></div>
            <div className="floating-glass float-one"><span className="float-icon"><Activity size={18}/></span><span><b>Ухаалаг удирдлага</b><small>Нэгдсэн хяналт</small></span><i/></div>
            <div className="floating-glass float-two"><span className="float-icon"><RadioTower size={18}/></span><span><b>Холболт</b><small>Тасралтгүй интеграц</small></span><i/></div>
            <div className="floating-glass float-three"><span className="float-icon"><Gauge size={18}/></span><span><b>Бүтээмж</b><small>Өгөгдөлд суурилсан</small></span><i/></div>
            <div className="floating-glass float-four"><span className="float-icon"><Layers3 size={18}/></span><span><b>Экосистем</b><small>Нэг цэгийн шийдэл</small></span><i/></div>
          </div>
        </div>
        <div className="hero-bottom-line"/>
      </section>

      <section id="about" className="about-section relative py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1380px] gap-14 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-12">
          <div className="reveal"><p className="section-kicker">БИД ХЭН БЭ</p><h2 className="section-title">Технологийг<br/> <span>утга учиртай</span><br/> шийдэл болгоно.</h2></div>
          <div className="about-copy reveal"><div className="about-mark"><Sparkles size={20}/></div><p>Бид инженерийн мэдлэг, орчин үеийн технологийг нэгтгэн байгууллагын бодит сорилтуудыг шийддэг. Найдвартай дэд бүтэц, оновчтой дизайн, саадгүй интеграцыг хослуулж, урт хугацаанд үнэ цэн бүтээх системийг бий болгоно.</p><a href="#contact" className="text-link mt-7">Манай багтай хамтран ажиллах <MoveUpRight size={16}/></a></div>
        </div>
        <div className="mx-auto mt-20 grid max-w-[1380px] grid-cols-2 gap-3 px-5 sm:px-8 sm:grid-cols-4 lg:px-12">
          {[["01","Инженерийн сэтгэлгээ"],["02","Цогц шийдэл"],["03","Найдвартай хэрэгжилт"],["04","Урт хугацааны дэмжлэг"]].map(([n,t],i)=><div key={n} className="stat-glass reveal"><span>{n}</span><p>{t}</p><div className="stat-line"/></div>)}
        </div>
      </section>

      <section id="solutions" className="solutions-section relative py-24 lg:py-32">
        <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
          <div className="mb-14 flex flex-col justify-between gap-7 md:flex-row md:items-end reveal"><div><p className="section-kicker">БИДНИЙ ШИЙДЛҮҮД</p><h2 className="section-title">Нарийн инженерчлэл.<br/><span>Бодит үр дүн.</span></h2></div><p className="max-w-md text-sm leading-7 text-slate-400">Нэг төхөөрөмжөөс эхлээд байгууллагын технологийн бүрэн экосистем хүртэл — таны үйл ажиллагаанд нийцсэн шийдэл.</p></div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {solutions.map(({icon:Icon,no,title,short,detail,tags},index)=><article key={no} className={`solution-glass reveal ${expanded === no ? "solution-expanded" : ""}`} style={{transitionDelay:`${index*70}ms`}}>
              <div className="flex items-start justify-between"><span className="solution-icon"><Icon size={23}/></span><span className="solution-number">{no}</span></div>
              <h3>{title}</h3><p className="solution-short">{short}</p>
              {expanded === no && <div className="solution-detail"><p>{detail}</p><div className="tag-row">{tags.map(tag=><span key={tag}>{tag}</span>)}</div></div>}
              <button type="button" className="solution-more" aria-expanded={expanded === no} onClick={()=>setExpanded(expanded === no ? null : no)}>{expanded === no ? "Хураах" : "Дэлгэрэнгүй"}{expanded === no ? <Minus size={15}/> : <Plus size={15}/>}</button>
              <div className="solution-accent"/>
            </article>)}
          </div>
        </div>
      </section>

      <section className="statement-section py-20 lg:py-24"><div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-9 px-5 sm:px-8 md:flex-row md:items-center lg:px-12"><div className="reveal"><p className="section-kicker">ТАНЫ ТЕХНОЛОГИЙН ТҮНШ</p><h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-5xl">Илүү ухаалаг ирээдүйг<br/><span>хамтдаа бүтээе.</span></h2></div><a href="#contact" className="button-primary button-large self-start md:self-auto">Төсөл ярилцах <ArrowUpRight size={17}/></a></div></section>

      <section id="contact" className="contact-section py-24 lg:py-28"><div className="mx-auto grid max-w-[1380px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_.85fr] lg:px-12"><div className="reveal"><p className="section-kicker">ХОЛБОО БАРИХ</p><h2 className="section-title">Дараагийн төслөө<br/><span>хамтдаа эхлүүлье.</span></h2><p className="mt-7 max-w-lg text-sm leading-7 text-slate-400">Төсөл, үйл ажиллагааны сорилт эсвэл технологийн зорилгынхоо талаар бидэнд мэдээлээрэй. Манай баг танд тохирох шийдлийг тодорхойлоход тусална.</p><div className="mt-10 grid gap-4 sm:grid-cols-2"><div className="contact-detail"><Mail size={18}/><span><small>И-мэйл</small><b>info@mosfet.mn</b></span></div><div className="contact-detail"><MapPin size={18}/><span><small>Байршил</small><b>Улаанбаатар, Монгол</b></span></div></div></div>
        <div className="contact-glass reveal"><div className="contact-glass-top"><span className="contact-orb"><Sparkles size={21}/></span><span className="contact-status"><i/> ХОЛБОО БАРИХАД БЭЛЭН</span></div><h3>Танд ямар шийдэл хэрэгтэй байна вэ?</h3><p>Инженерчлэл, автоматжуулалт, хамгаалалт эсвэл программ хангамжийн хэрэгцээгээ манай багтай ярилцаарай.</p><a href="mailto:info@mosfet.mn?subject=Төслийн%20хүсэлт" className="button-primary button-large w-full">И-мэйл илгээх <ArrowUpRight size={17}/></a><div className="contact-note"><CheckCircle2 size={15}/> Бид таны хүсэлтэд аль болох хурдан хариу өгнө.</div></div>
      </div></section>

      <footer className="site-footer"><div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-6 px-5 py-9 sm:px-8 md:flex-row md:items-center lg:px-12"><Link href="/" className="text-lg font-extrabold tracking-[.12em]">MOSFET<span className="text-cyan-300">.</span></Link><p className="text-xs text-slate-400">Инженерчлэл · Автоматжуулалт · Технологи</p><p className="text-[11px] text-slate-500">© {new Date().getFullYear()} MOSFET. Бүх эрх хуулиар хамгаалагдсан.</p></div></footer>
    </main>
  );
}
