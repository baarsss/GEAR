"use client";

import { CarFront, ChevronDown, Clock3, Heart, List, Map, MapPin, Menu, Search, SlidersHorizontal, Sparkles, Wrench, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ServiceMap from "./service-map";
import AuthForm from "./auth-form";
import { brands, categories, cities, models, providers as demoProviders, services, type Category, type City, type Provider } from "./catalog-data";

type Language = "ru" | "be" | "en";
type Sort = "match" | "cheap" | "expensive" | "new";
type Filters = {
  category: Category | "";
  brand: string;
  model: string;
  city: City | "Вся Беларусь";
  minPrice: string;
  maxPrice: string;
  openNow: boolean;
  today: boolean;
  aroundClock: boolean;
  mobile: boolean;
  urgent: boolean;
  card: boolean;
  cash: boolean;
};
const defaults: Filters = { category:"", brand:"", model:"", city:"Вся Беларусь", minPrice:"", maxPrice:"", openNow:false, today:false, aroundClock:false, mobile:false, urgent:false, card:false, cash:false };
type Panel = "categories" | "car" | "location" | "login" | "provider" | null;

const copy = {
  ru: { catalog:"Каталог",how:"Как это работает",providers:"Исполнителям",allServices:"Все услуги",signIn:"Войти",providerCabinet:"Кабинет исполнителя",eyebrow:"Автоуслуги по всей Беларуси",title:"Найдите сервис под вашу задачу",subtitle:"Сравнивайте условия, цены и расположение — без лишних звонков.",task:"Что нужно сделать?",car:"Автомобиль",where:"Где искать?",find:"Найти",filters:"Фильтры",category:"Категория",brand:"Марка",model:"Модель",price:"Цена, BYN",from:"от",to:"до",when:"Когда",openNow:"Открыто сейчас",today:"Можно сегодня",aroundClock:"Круглосуточно",format:"Формат услуги",mobile:"Выезд к автомобилю",urgent:"Срочный ремонт",payment:"Оплата",card:"Банковская карта",cash:"Наличные",show:"Показать варианты",reset:"Сбросить фильтры",results:"Подходящие услуги",found:"вариантов найдено",sortMatch:"По соответствию",sortCheap:"Сначала дешевле",sortExpensive:"Сначала дороже",sortNew:"Сначала новые",list:"Список",map:"Карта",promotion:"Продвижение",openUntil:"Открыто сейчас",closed:"Сейчас закрыто",details:"Подробнее",empty:"По этим параметрам пока нет объявлений",emptyHint:"Попробуйте убрать один или несколько фильтров.",howTitle:"Как работает GEAR",step1:"Опишите задачу",step1Body:"Выберите услугу, автомобиль, город и удобное время.",step2:"Сравните варианты",step2Body:"Посмотрите цены, условия работы и точки на карте.",step3:"Свяжитесь напрямую",step3Body:"Откройте карточку исполнителя и позвоните по указанному номеру.",providerTitle:"Получайте обращения от подходящих клиентов",providerText:"Создайте карточку услуг, добавьте точки работы и при необходимости подключите продвижение.",conditions:"Узнать об условиях",contact:"Контакт",call:"Позвонить",demo:"Демонстрационные объявления",demoNote:"Карточки и контакты показаны для проверки интерфейса. Новые объявления подключаются из базы после публикации администратором.",loginTitle:"Вход в GEAR",loginText:"Регистрация по почте будет подключена вместе с личными кабинетами.",providerTextModal:"Здесь появятся управление услугами и оплата продвижения после подключения аккаунтов.",email:"Электронная почта",continue:"Продолжить",emailDemo:"Письмо пока не отправляется: авторизация находится в разработке.",apply:"Применить",any:"Любая",anyModel:"Любая модель",allCountry:"Вся Беларусь",language:"Язык",searchPlaceholder:"Название услуги или поломка",chooseCategory:"Выберите услугу",chooseCity:"Выберите город",chooseCar:"Выберите автомобиль",phone:"Телефон",noBrands:"Все марки",clearSearch:"Очистить поиск" },
  be: { catalog:"Каталог",how:"Як гэта працуе",providers:"Выканаўцам",allServices:"Усе паслугі",signIn:"Увайсці",providerCabinet:"Кабінет выканаўцы",eyebrow:"Аўтапаслугі па ўсёй Беларусі",title:"Знайдзіце сэрвіс для сваёй задачы",subtitle:"Параўноўвайце ўмовы, цэны і размяшчэнне.",task:"Што трэба зрабіць?",car:"Аўтамабіль",where:"Дзе шукаць?",find:"Знайсці",filters:"Фільтры",category:"Катэгорыя",brand:"Марка",model:"Мадэль",price:"Цана, BYN",from:"ад",to:"да",when:"Калі",openNow:"Адкрыта цяпер",today:"Можна сёння",aroundClock:"Кругласутачна",format:"Фармат паслугі",mobile:"Выезд да аўтамабіля",urgent:"Тэрміновы рамонт",payment:"Аплата",card:"Банкаўская карта",cash:"Наяўныя",show:"Паказаць варыянты",reset:"Скінуць фільтры",results:"Прыдатныя паслугі",found:"варыянтаў знойдзена",sortMatch:"Па адпаведнасці",sortCheap:"Спачатку таннейшыя",sortExpensive:"Спачатку даражэйшыя",sortNew:"Спачатку новыя",list:"Спіс",map:"Карта",promotion:"Прасоўванне",openUntil:"Адкрыта цяпер",closed:"Цяпер зачынена",details:"Падрабязней",empty:"Аб'яў па гэтых параметрах няма",emptyHint:"Паспрабуйце прыбраць адзін або некалькі фільтраў.",howTitle:"Як працуе GEAR",step1:"Апішыце задачу",step1Body:"Абярыце паслугу, аўтамабіль, горад і зручны час.",step2:"Параўнайце варыянты",step2Body:"Паглядзіце цэны, умовы і пункты на карце.",step3:"Звяжыцеся наўпрост",step3Body:"Адкрыйце картку выканаўцы і патэлефануйце.",providerTitle:"Атрымлівайце звароты ад кліентаў",providerText:"Стварыце картку паслуг, дадайце пункты працы і падключыце прасоўванне.",conditions:"Даведацца пра ўмовы",contact:"Кантакт",call:"Патэлефанаваць",demo:"Дэманстрацыйныя аб'явы",demoNote:"Карткі і кантакты паказаны для праверкі інтэрфейсу.",loginTitle:"Уваход у GEAR",loginText:"Рэгістрацыя праз пошту з'явіцца разам з асабістымі кабінетамі.",providerTextModal:"Тут з'явіцца кіраванне паслугамі і аплата прасоўвання.",email:"Электронная пошта",continue:"Працягнуць",emailDemo:"Ліст пакуль не адпраўляецца: аўтарызацыя распрацоўваецца.",apply:"Ужыць",any:"Любая",anyModel:"Любая мадэль",allCountry:"Уся Беларусь",language:"Мова",searchPlaceholder:"Назва паслугі або паломка",chooseCategory:"Абярыце паслугу",chooseCity:"Абярыце горад",chooseCar:"Абярыце аўтамабіль",phone:"Тэлефон",noBrands:"Усе маркі",clearSearch:"Ачысціць пошук" },
  en: { catalog:"Catalog",how:"How it works",providers:"For providers",allServices:"All services",signIn:"Sign in",providerCabinet:"Provider account",eyebrow:"Car services across Belarus",title:"Find the right service for your car",subtitle:"Compare options, prices and locations.",task:"What do you need?",car:"Your car",where:"Where?",find:"Search",filters:"Filters",category:"Category",brand:"Make",model:"Model",price:"Price, BYN",from:"min",to:"max",when:"When",openNow:"Open now",today:"Available today",aroundClock:"24/7",format:"Service type",mobile:"Mobile service",urgent:"Urgent repair",payment:"Payment",card:"Bank card",cash:"Cash",show:"Show results",reset:"Reset filters",results:"Matching services",found:"results found",sortMatch:"Best match",sortCheap:"Lowest price",sortExpensive:"Highest price",sortNew:"Newest",list:"List",map:"Map",promotion:"Promoted",openUntil:"Open now",closed:"Closed now",details:"Details",empty:"No listings match these filters",emptyHint:"Try removing one or more filters.",howTitle:"How GEAR works",step1:"Describe the issue",step1Body:"Choose a service, car, city and convenient time.",step2:"Compare options",step2Body:"Check prices, terms and locations on the map.",step3:"Contact directly",step3Body:"Open a provider card and call the listed number.",providerTitle:"Get requests from relevant customers",providerText:"Create a service profile, add locations and promote your listing.",conditions:"Learn more",contact:"Contact",call:"Call",demo:"Sample listings",demoNote:"Cards and contacts are sample data for reviewing the interface.",loginTitle:"Sign in to GEAR",loginText:"Email sign in will be connected with user accounts.",providerTextModal:"Service management and promotion payments will appear here.",email:"Email",continue:"Continue",emailDemo:"No email was sent: sign in is still being developed.",apply:"Apply",any:"Any",anyModel:"Any model",allCountry:"All Belarus",language:"Language",searchPlaceholder:"Service or issue",chooseCategory:"Choose a service",chooseCity:"Choose a city",chooseCar:"Choose a car",phone:"Phone",noBrands:"All makes",clearSearch:"Clear search" },
} as const;

const modelSupport: Record<number, Record<string, string[]>> = {
  1: { BMW: ["3 серия", "5 серия", "X3"], Audi: ["A3", "A4"] },
  2: { BMW: ["3 серия", "X5"], Audi: ["A4", "A6"], Volkswagen: ["Golf", "Passat"], Toyota: ["Corolla", "Camry"] },
  3: { BMW: ["3 серия", "5 серия"], "Mercedes-Benz": ["C-Class", "E-Class"] },
  4: { BMW: ["X3", "X5"], Volkswagen: ["Golf", "Tiguan"], Toyota: ["Camry", "RAV4"] },
  5: { BMW: ["3 серия", "X3"], Audi: ["A4", "Q5"], Toyota: ["Corolla", "RAV4"] },
  7: { BMW: ["3 серия", "5 серия"], "Mercedes-Benz": ["C-Class", "E-Class"], Volkswagen: ["Golf", "Passat"] },
  9: { BMW: ["3 серия", "5 серия", "X5"], Audi: ["A3", "A4"], Toyota: ["Corolla", "Camry"] },
};

function matches(provider:Provider, filters:Filters, query:string) {
  const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const searchText=[provider.name,provider.service,provider.category,provider.description,...(provider.offerings??[]).map(item=>item.name),...provider.brands].join(" ").toLocaleLowerCase();
  if (words.some(word=>!searchText.includes(word))) return false;
  if (filters.category && provider.category !== filters.category) return false;
  if (filters.brand && !provider.brands.includes(filters.brand) && !provider.brands.includes("Все марки")) return false;
  if (filters.model && filters.brand && !provider.brands.includes("Все марки")) {
    const supported = provider.supportedModels?.[filters.brand] ?? modelSupport[provider.id]?.[filters.brand];
    if (supported?.length && !supported.includes(filters.model)) return false;
  }
  if (filters.city !== "Вся Беларусь" && provider.city !== filters.city && !provider.promoted) return false;
  if (filters.minPrice && provider.price < Number(filters.minPrice)) return false;
  if (filters.maxPrice && provider.price > Number(filters.maxPrice)) return false;
  if (filters.openNow && !provider.openNow) return false;
  if (filters.today && !provider.availableToday) return false;
  if (filters.aroundClock && !provider.aroundClock) return false;
  if (filters.mobile && !provider.mobile) return false;
  if (filters.urgent && !provider.urgent) return false;
  if (filters.card && !provider.payment.includes("card")) return false;
  if (filters.cash && !provider.payment.includes("cash")) return false;
  return true;
}

export default function Home() {
  const [language,setLanguage]=useState<Language>("ru");
  const t=copy[language];
  const [filters,setFilters]=useState<Filters>(defaults);
  const [draftQuery,setDraftQuery]=useState("");
  const [query,setQuery]=useState("");
  const [sort,setSort]=useState<Sort>("match");
  const [view,setView]=useState<"list"|"map">("list");
  const [filterDrawer,setFilterDrawer]=useState(false);
  const [panel,setPanel]=useState<Panel>(null);
  const [favorites,setFavorites]=useState<number[]>([]);
  const [liveProviders,setLiveProviders]=useState<Provider[]>([]);
  const [databaseConnected,setDatabaseConnected]=useState(false);

  useEffect(()=>{
    const controller = new AbortController();
    fetch("/api/catalog",{cache:"no-store",signal:controller.signal})
      .then(async response=>{if(!response.ok)throw new Error("Catalog unavailable");return response.json() as Promise<{items:Provider[];connected:boolean}>})
      .then(data=>{if(!controller.signal.aborted){setLiveProviders(data.items);setDatabaseConnected(data.connected)}})
      .catch(()=>{if(!controller.signal.aborted)setDatabaseConnected(false)});
    return ()=>controller.abort();
  },[]);
  const allProviders=useMemo(()=>[...liveProviders,...demoProviders],[liveProviders]);
  const availableCities=useMemo(()=>[...new Set([...cities.filter(city=>city!=="Вся Беларусь"),...allProviders.map(item=>item.city)]),"Вся Беларусь"],[allProviders]);

  const update=<K extends keyof Filters>(key:K,value:Filters[K])=>setFilters(current=>({...current,[key]:value,...(key==="brand"?{model:""}:{})}));
  const results=useMemo(()=>{
    const items=allProviders.filter(item=>matches(item,filters,query));
    return items.sort((a,b)=>{
      const source=Number(a.isDemo !== false)-Number(b.isDemo !== false);
      if(source) return source;
      const promotion=Number(b.promoted)-Number(a.promoted);
      if(promotion) return promotion;
      if(sort==="cheap") return a.price-b.price;
      if(sort==="expensive") return b.price-a.price;
      if(sort==="new") return b.createdAt-a.createdAt;
      return a.id-b.id;
    });
  },[allProviders,filters,query,sort]);
  const chips:{key:string;label:string;remove:()=>void}[]=[];
  if(query) chips.push({key:"query",label:query,remove:()=>{setQuery("");setDraftQuery("")}});
  if(filters.category) chips.push({key:"category",label:filters.category,remove:()=>update("category","")});
  if(filters.brand) chips.push({key:"brand",label:filters.brand,remove:()=>update("brand","")});
  if(filters.model) chips.push({key:"model",label:filters.model,remove:()=>update("model","")});
  if(filters.city!=="Вся Беларусь") chips.push({key:"city",label:filters.city,remove:()=>update("city","Вся Беларусь")});
  if(filters.minPrice) chips.push({key:"min",label:`${t.from} ${filters.minPrice} BYN`,remove:()=>update("minPrice","")});
  if(filters.maxPrice) chips.push({key:"max",label:`${t.to} ${filters.maxPrice} BYN`,remove:()=>update("maxPrice","")});
  for(const key of ["openNow","today","aroundClock","mobile","urgent","card","cash"] as const) if(filters[key]) chips.push({key,label:t[key],remove:()=>update(key,false)});
  const search=(event?:FormEvent)=>{event?.preventDefault();setQuery(draftQuery.trim());if(draftQuery.trim()) update("category","");document.getElementById("catalog")?.scrollIntoView({behavior:"smooth"})};
  const reset=()=>{setFilters({...defaults,category:"",brand:"",city:"Вся Беларусь",today:false});setQuery("");setDraftQuery("");setSort("match")};
  const toggleFavorite=(id:number)=>setFavorites(list=>list.includes(id)?list.filter(value=>value!==id):[...list,id]);

  return <main className="gear-page">
    <div className="utility"><div className="wrap utility-in"><nav><a href="#catalog">{t.catalog}</a><a href="#how">{t.how}</a><a href="#providers">{t.providers}</a></nav><div className="languages" aria-label={t.language}>{(["ru","be","en"] as const).map(value=><button key={value} className={language===value?"active":""} onClick={()=>setLanguage(value)}>{value.toUpperCase()}</button>)}</div></div></div>
    <header><div className="wrap header-in"><a className="logo" href="#top" aria-label="GEAR">GEAR<span>.</span></a><button className="pill categories" onClick={()=>setPanel("categories")}><Menu size={18}/>{t.allServices}</button><form className="top-search" onSubmit={search}><input aria-label={t.searchPlaceholder} placeholder={t.searchPlaceholder} value={draftQuery} onChange={event=>setDraftQuery(event.target.value)}/>{draftQuery&&<button type="button" aria-label={t.clearSearch} onClick={()=>{setDraftQuery("");setQuery("")}}><X size={16}/></button>}<button type="submit" aria-label={t.find}><Search size={19}/></button></form><button className="pill city" onClick={()=>setPanel("location")}><MapPin size={18}/>{filters.city==="Вся Беларусь"?t.allCountry:filters.city}<ChevronDown size={15}/></button><button className="pill login" onClick={()=>setPanel("login")}>{t.signIn}</button><button className="pill provider" onClick={()=>setPanel("provider")}>{t.providerCabinet}</button></div></header>
    <section className="wrap intro" id="top"><div><p className="overline">{t.eyebrow}</p><h1>{t.title}</h1><p className="subtitle">{t.subtitle}</p></div><div className="chrome"><Wrench size={36}/></div></section>
    <form className="wrap finder" onSubmit={search}><label><small>{t.task}</small><div><Wrench size={18}/><input placeholder={t.searchPlaceholder} value={draftQuery} onChange={event=>setDraftQuery(event.target.value)}/></div></label><div className="finder-choice"><small>{t.car}</small><button type="button" onClick={()=>setPanel("car")}><CarFront size={18}/>{filters.brand?`${filters.brand}${filters.model?` · ${filters.model}`:""}`:t.any}<ChevronDown size={15}/></button></div><div className="finder-choice"><small>{t.where}</small><button type="button" onClick={()=>setPanel("location")}><MapPin size={18}/>{filters.city==="Вся Беларусь"?t.allCountry:filters.city}<ChevronDown size={15}/></button></div><button className="find" type="submit"><Search size={19}/><span>{t.find}</span></button></form>
    <div className="wrap chips">{chips.map(chip=><button key={chip.key} onClick={chip.remove}>{chip.label}<X size={14}/></button>)}<button className="filter-open" onClick={()=>setFilterDrawer(true)}><SlidersHorizontal size={16}/>{t.filters}</button></div>
    <div className="wrap layout" id="catalog"><aside className={filterDrawer?"filters show":"filters"}><div className="filter-title"><b>{t.filters}</b><button aria-label="Close" onClick={()=>setFilterDrawer(false)}><X/></button></div>
      <button className="field-trigger" onClick={()=>setPanel("categories")}><span>{t.category}</span><b>{filters.category||t.any} <ChevronDown size={16}/></b></button>
      <Field label={t.where} value={filters.city} onChange={value=>update("city",value as City|"Вся Беларусь")} options={availableCities} empty={t.allCountry} includeEmpty={false}/>
      <button className="field-trigger" onClick={()=>setPanel("car")}><span>{t.brand}</span><b>{filters.brand||t.noBrands} <ChevronDown size={16}/></b></button>
      <button className="field-trigger" onClick={()=>setPanel("car")}><span>{t.model}</span><b>{filters.model||t.anyModel} <ChevronDown size={16}/></b></button>
      <div className="filter-block"><b>{t.price}</b><div className="prices"><input aria-label={t.from} inputMode="numeric" type="number" min="0" placeholder={t.from} value={filters.minPrice} onChange={event=>update("minPrice",event.target.value)}/><input aria-label={t.to} inputMode="numeric" type="number" min="0" placeholder={t.to} value={filters.maxPrice} onChange={event=>update("maxPrice",event.target.value)}/></div></div>
      <div className="filter-block"><b>{t.when}</b><CheckField label={t.openNow} checked={filters.openNow} onChange={value=>update("openNow",value)}/><CheckField label={t.today} checked={filters.today} onChange={value=>update("today",value)}/><CheckField label={t.aroundClock} checked={filters.aroundClock} onChange={value=>update("aroundClock",value)}/></div>
      <div className="filter-block"><b>{t.format}</b><CheckField label={t.mobile} checked={filters.mobile} onChange={value=>update("mobile",value)}/><CheckField label={t.urgent} checked={filters.urgent} onChange={value=>update("urgent",value)}/></div>
      <div className="filter-block"><b>{t.payment}</b><CheckField label={t.card} checked={filters.card} onChange={value=>update("card",value)}/><CheckField label={t.cash} checked={filters.cash} onChange={value=>update("cash",value)}/></div>
      <button className="apply" onClick={()=>setFilterDrawer(false)}>{t.show} ({results.length})</button><button className="reset" onClick={reset}>{t.reset}</button>
    </aside><section className="results"><div className="toolbar"><div><h2>{t.results}</h2><p>{language==="ru"?`Найдено: ${results.length}`:language==="be"?`Знойдзена: ${results.length}`:`${results.length} ${t.found}`}</p></div><div className="tools"><label className="sort-label"><span className="sr-only">Sort</span><select value={sort} onChange={event=>setSort(event.target.value as Sort)}><option value="match">{t.sortMatch}</option><option value="cheap">{t.sortCheap}</option><option value="expensive">{t.sortExpensive}</option><option value="new">{t.sortNew}</option></select><ChevronDown size={15}/></label><div className="switch"><button className={view==="list"?"on":""} onClick={()=>setView("list")}><List size={18}/><span>{t.list}</span></button><button className={view==="map"?"on":""} onClick={()=>setView("map")}><Map size={18}/><span>{t.map}</span></button></div></div></div>
      {results.length===0?<div className="empty-results"><Search size={34}/><h3>{t.empty}</h3><p>{t.emptyHint}</p><button className="outline-button" onClick={reset}>{t.reset}</button></div>:view==="list"?<div className="cards">{results.map(item=><ServiceCard key={item.id} service={item} t={t} favorite={favorites.includes(item.id)} onFavorite={()=>toggleFavorite(item.id)} onOpen={()=>window.location.assign(`/service/${item.id}`)}/>)}</div>:<ServiceMap items={results} city={filters.city} onOpen={id=>window.location.assign(`/service/${id}`)}/>}
      {allProviders.some(item=>item.isDemo !== false)&&<p className="demo-label">{t.demo}</p>}
      {!databaseConnected&&<p className="demo-label">{language==="en"?"Live listings are not connected yet.":language==="be"?"Рэальныя аб'явы пакуль не падключаны.":"База реальных объявлений пока не подключена."}</p>}
    </section></div>
    <section className="how-section" id="how"><div className="wrap"><p className="overline">GEAR</p><h2>{t.howTitle}</h2><div className="steps"><article><span>01</span><h3>{t.step1}</h3><p>{t.step1Body}</p></article><article><span>02</span><h3>{t.step2}</h3><p>{t.step2Body}</p></article><article><span>03</span><h3>{t.step3}</h3><p>{t.step3Body}</p></article></div><a href="#catalog" className="black-button">{t.find}</a></div></section>
    <section className="provider-section" id="providers"><div className="wrap provider-inner"><div><p className="overline">GEAR</p><h2>{t.providerTitle}</h2><p>{t.providerText}</p></div><button className="outline-button" onClick={()=>setPanel("provider")}>{t.conditions}</button></div></section>
    <footer><div className="wrap"><a className="logo" href="#top">GEAR<span>.</span></a><p>{t.eyebrow}</p><div className="languages" aria-label={t.language}>{(["ru","be","en"] as const).map(value=><button key={value} className={language===value?"active":""} onClick={()=>setLanguage(value)}>{value.toUpperCase()}</button>)}</div></div></footer>
    <Dialog open={panel!==null} onOpenChange={open=>!open&&setPanel(null)}><DialogContent className="gear-dialog">{panel&&<PanelContent key={panel} panel={panel} close={()=>setPanel(null)} t={t} language={language} filters={filters} availableCities={availableCities} update={update} chooseService={value=>{setDraftQuery(value);setQuery(value);update("category","")}}/>}</DialogContent></Dialog>
  </main>;
}

function Field({label,value,onChange,options,empty,disabled=false,includeEmpty=true}:{label:string;value:string;onChange:(value:string)=>void;options:readonly string[];empty:string;disabled?:boolean;includeEmpty?:boolean}){return <label className="field-select"><span>{label}</span><select aria-label={label} value={value} onChange={event=>onChange(event.target.value)} disabled={disabled}>{includeEmpty&&<option value="">{empty}</option>}{options.map(option=><option key={option} value={option}>{option}</option>)}</select></label>}
function CheckField({label,checked,onChange}:{label:string;checked:boolean;onChange:(value:boolean)=>void}){return <label className="check-field"><input type="checkbox" checked={checked} onChange={event=>onChange(event.target.checked)}/>{label}</label>}
function ServiceCard({service,t,favorite,onFavorite,onOpen}:{service:Provider;t:typeof copy[Language];favorite:boolean;onFavorite:()=>void;onOpen:()=>void}){return <article className={service.promoted?"card promoted":"card"} onClick={event=>{if(!(event.target as HTMLElement).closest("button,a"))onOpen()}}><button className="image" onClick={onOpen} aria-label={`${t.details}: ${service.name}`}><CarFront size={54} strokeWidth={1.1}/>{service.promoted&&<span className="promo"><Sparkles size={13}/>{t.promotion}</span>}{service.isDemo!==false&&<span className="demo-card-mark">Демо</span>}</button><div className="info"><div className="card-title"><div><button className="title-link" onClick={onOpen}><h3>{service.name}</h3></button><p>{service.service}</p></div><button className={favorite?"heart saved":"heart"} onClick={onFavorite} aria-label={favorite?"Remove from favorites":"Add to favorites"}><Heart size={21}/></button></div><div className="tags"><span>{service.category}</span><span>{service.brands.includes("Все марки")?t.noBrands:service.brands.join(", ")}</span>{service.mobile&&<span>{t.mobile}</span>}</div><div className="meta"><span><MapPin size={15}/>{service.address}</span><span className={service.openNow?"opened":"closed"}><Clock3 size={15}/>{service.openNow?t.openUntil:t.closed}</span></div></div><div className="action"><strong>{service.priceLabel}</strong><button onClick={onOpen}>{t.details}</button></div></article>}
function PanelContent({panel,close,t,language,filters,availableCities,update,chooseService}:{panel:Exclude<Panel,null>;close:()=>void;t:typeof copy[Language];language:Language;filters:Filters;availableCities:string[];update:<K extends keyof Filters>(key:K,value:Filters[K])=>void;chooseService:(value:string)=>void}){
  if(panel==="categories")return <CategoryPicker selected={filters.category} title={t.chooseCategory} onCategory={value=>{update("category",value);close()}} onService={value=>{chooseService(value);close()}}/>;
  if(panel==="location")return <><DialogHeader><DialogTitle>{t.chooseCity}</DialogTitle></DialogHeader><div className="choice-grid cities">{availableCities.map(city=><button className={filters.city===city?"chosen":""} key={city} onClick={()=>{update("city",city);close()}}><MapPin size={18}/>{city==="Вся Беларусь"?t.allCountry:city}</button>)}</div></>;
  if(panel==="car")return <CarPicker filters={filters} update={update} close={close} t={t}/>;
  return <><DialogHeader><DialogTitle>{panel==="provider"?t.providerCabinet:t.loginTitle}</DialogTitle><DialogDescription>{panel==="provider"?t.providerTextModal:t.loginText}</DialogDescription></DialogHeader><AuthForm language={language} labels={t}/></>;
}

function CategoryPicker({selected,title,onCategory,onService}:{selected:Category|"";title:string;onCategory:(value:Category|"")=>void;onService:(value:string)=>void}){
  const [term,setTerm]=useState("");
  const needle=term.trim().toLocaleLowerCase();
  const foundCategories=categories.filter(value=>value.toLocaleLowerCase().includes(needle));
  const foundServices=needle?categories.flatMap(category=>services[category].filter(value=>value.toLocaleLowerCase().includes(needle)).map(value=>({category,value}))):[];
  return <><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>Найдите категорию или конкретную услугу. Если её нет, ищите по описанию объявления.</DialogDescription></DialogHeader><div className="picker-search"><Search size={18}/><input autoFocus aria-label="Поиск категории или услуги" placeholder="Например, аккумулятор или кондиционер" value={term} onChange={event=>setTerm(event.target.value)}/></div><div className="picker-list"><button className={!selected?"chosen":""} onClick={()=>onCategory("")}>Все категории</button>{foundCategories.map(category=><button className={selected===category?"chosen":""} key={category} onClick={()=>onCategory(category)}><Wrench size={17}/>{category}</button>)}{foundServices.map(({category,value})=><button key={`${category}-${value}`} onClick={()=>onService(value)}><Search size={16}/><span>{value}<small>{category}</small></span></button>)}{!foundCategories.length&&!foundServices.length&&<p className="picker-empty">Нет в списке? Выберите «Другое» или введите запрос в общий поиск.</p>}</div></>;
}

function CarPicker({filters,update,close,t}:{filters:Filters;update:<K extends keyof Filters>(key:K,value:Filters[K])=>void;close:()=>void;t:typeof copy[Language]}){
  const [brandSearch,setBrandSearch]=useState("");
  const [modelSearch,setModelSearch]=useState("");
  const shownBrands=brands.filter(value=>value.toLocaleLowerCase().includes(brandSearch.trim().toLocaleLowerCase()));
  const availableModels=models[filters.brand]??[];
  const shownModels=availableModels.filter(value=>value.toLocaleLowerCase().includes(modelSearch.trim().toLocaleLowerCase()));
  return <><DialogHeader><DialogTitle>{t.chooseCar}</DialogTitle><DialogDescription>Начните вводить марку или модель и выберите вариант из списка.</DialogDescription></DialogHeader><div className="car-picker"><section><h3>{t.brand}</h3><div className="picker-search"><Search size={17}/><input aria-label="Поиск марки" placeholder="Поиск марки" value={brandSearch} onChange={event=>setBrandSearch(event.target.value)}/></div><div className="picker-list"><button className={!filters.brand?"chosen":""} onClick={()=>update("brand","")}>{t.noBrands}</button>{shownBrands.map(value=><button className={filters.brand===value?"chosen":""} key={value} onClick={()=>{update("brand",value);setModelSearch("")}}>{value}</button>)}{!shownBrands.length&&<p className="picker-empty">Марка не найдена</p>}</div></section><section><h3>{t.model}</h3><div className="picker-search"><Search size={17}/><input aria-label="Поиск модели" placeholder="Поиск модели" value={modelSearch} onChange={event=>setModelSearch(event.target.value)} disabled={!filters.brand}/></div><div className="picker-list"><button className={!filters.model?"chosen":""} onClick={()=>update("model","")}>{t.anyModel}</button>{shownModels.map(value=><button className={filters.model===value?"chosen":""} key={value} onClick={()=>update("model",value)}>{value}</button>)}{filters.brand&&!availableModels.length&&<p className="picker-empty">Для этой марки модели пока не добавлены. Поиск по марке доступен.</p>}{filters.brand&&availableModels.length&&!shownModels.length&&<p className="picker-empty">Модель не найдена</p>}</div></section></div><button className="black-button picker-apply" onClick={close}>{t.apply}</button></>;
}
