import { ArrowLeft, BadgeCheck, CalendarDays, CarFront, Clock3, CreditCard, MapPin, Phone, ShieldCheck, Wrench } from "lucide-react";
import { notFound } from "next/navigation";
import { providers, type Provider } from "../../catalog-data";
import ProviderMap from "./provider-map";

export async function generateStaticParams() {
  return providers.map(provider=>({id:String(provider.id)}));
}

export default async function ProviderPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const provider=providers.find(item=>item.id===Number(id));
  if(!provider) notFound();
  const points=provider.locations??[{address:provider.address,lat:provider.lat,lng:provider.lng}];
  const offerings=provider.offerings??[{name:provider.service,price:provider.priceLabel}];
  return <main className="profile-page">
    <header className="profile-header"><div className="wrap"><a className="logo" href="/">GEAR<span>.</span></a><a className="profile-back" href="/#catalog"><ArrowLeft size={17}/> К объявлениям</a></div></header>
    <div className="wrap profile-main"><div className="profile-breadcrumb"><a href="/">Каталог</a><span> / </span><span>{provider.category}</span><span> / </span><strong>{provider.name}</strong></div>
      <div className="profile-heading"><div><span className="profile-eyebrow">{provider.kind??(provider.mobile?"Выездной специалист":"Автосервис")}</span><h1>{provider.name}</h1><p>{provider.service}</p></div><div className="profile-price"><small>Стоимость услуги</small><strong>{provider.priceLabel}</strong><span>Точная цена согласовывается с исполнителем</span></div></div>
      <div className="profile-notice"><ShieldCheck size={19}/><span>Демонстрационная карточка. Данные исполнителя, адреса и цены приведены для примера. Связаться с ним пока нельзя.</span></div>
      <div className="profile-grid"><div className="profile-primary"><div className="profile-hero"><CarFront size={86} strokeWidth={1.1}/><span>GEAR · АВТОУСЛУГИ</span></div>
        <section className="profile-section"><h2>О сервисе</h2><p>{provider.description??`${provider.name} предлагает услугу «${provider.service}». Подберите удобную точку и уточните детали напрямую у исполнителя после публикации реального объявления.`}</p><div className="profile-facts"><span><Wrench size={18}/>{provider.mobile?"Выезд к автомобилю":"Работа на точке"}</span><span><Clock3 size={18}/>{provider.aroundClock?"Круглосуточно":provider.openNow?"Открыто сейчас":"График уточняется"}</span><span><CreditCard size={18}/>{provider.payment.includes("card")&&provider.payment.includes("cash")?"Карта и наличные":provider.payment.includes("card")?"Банковская карта":"Наличные"}</span>{provider.availableToday&&<span><CalendarDays size={18}/>Возможно сегодня</span>}</div></section>
        <section className="profile-section"><h2>Услуги и цены</h2><p className="profile-muted">Если у исполнителя несколько точек, стоимость одной и той же услуги одинакова на всех.</p><div className="profile-service-list">{offerings.map(item=><div key={item.name}><span>{item.name}</span><strong>{item.price}</strong></div>)}</div></section>
        <section className="profile-section"><h2>Автомобили</h2><p>Марки: {provider.brands.join(", ")}. По конкретной модели и комплектации условия нужно уточнить у исполнителя.</p></section>
        <section className="profile-section"><h2>Где находится</h2><div className="profile-locations">{points.map((point,index)=><div id={`location-${index}`} key={`${point.address}-${index}`}><MapPin size={19}/><span><b>Точка {index+1}</b><small>{point.address} · ориентировочное расположение</small></span></div>)}</div><ProviderMap provider={provider} /></section>
      </div><aside className="profile-aside"><div className="profile-contact"><h2>Контакты</h2><p>В реальном объявлении здесь будет телефон исполнителя. Чат и отзывы доступны только зарегистрированным пользователям мобильного приложения.</p><div className="profile-phone"><Phone size={18}/> Номер появится после публикации</div><a href="/#catalog">Вернуться к поиску</a></div><div className="profile-side-note"><BadgeCheck size={20}/><span>Статус проверки юрлица будет показан только после проверки документов. Демонстрационная карточка не имеет статуса проверки.</span></div></aside></div>
    </div>
  </main>;
}
