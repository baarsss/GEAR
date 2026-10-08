"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { brands, categories, cities, services, type Category } from "@/app/catalog-data";
import { getBrowserClient, loadOwnProfile, type UserProfile } from "@/lib/supabase-browser";
import LocationPicker, { type LocationDraft } from "./location-picker";

type OwnEntry = { id: number; name: string; service: string; status: string; created_at: string };
type OfferingDraft = { name: string; price: string };
const emptyLocation = (): LocationDraft => ({ address: "", lat: null, lng: null });
const statusLabel: Record<string, string> = { draft: "Черновик", pending: "На модерации", published: "Опубликовано", hidden: "Скрыто" };

export default function ProviderPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState("");
  const [ownEntries, setOwnEntries] = useState<OwnEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState("Автосервис");
  const [providerType, setProviderType] = useState<"private" | "legal">("private");
  const [category, setCategory] = useState<Category>("Диагностика");
  const [offerings, setOfferings] = useState<OfferingDraft[]>([{ name: "", price: "" }]);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Минск");
  const [locations, setLocations] = useState<LocationDraft[]>([emptyLocation()]);
  const [activeLocation, setActiveLocation] = useState(0);
  const [phone, setPhone] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandQuery, setBrandQuery] = useState("");
  const [acceptsCard, setAcceptsCard] = useState(false);
  const [acceptsCash, setAcceptsCash] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [aroundClock, setAroundClock] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const supabase = await getBrowserClient();
        const { data: sessionData } = await supabase.auth.getSession();
        const ownProfile = await loadOwnProfile();
        if (!active) return;
        setProfile(ownProfile);
        setEmail(sessionData.session?.user.email ?? "");
        if (ownProfile?.role === "provider") {
          const { data, error: listError } = await supabase.from("catalog_entries")
            .select("id,name,service,status,created_at").eq("owner_id", ownProfile.user_id)
            .order("created_at", { ascending: false });
          if (listError) throw listError;
          if (active) setOwnEntries(data as OwnEntry[]);
        }
      } catch (cause) { if (active) setError(cause instanceof Error ? cause.message : "Не удалось открыть кабинет."); }
      finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, []);

  function updateLocation(index: number, patch: Partial<LocationDraft>) {
    setLocations(items => items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }
  function updateOffering(index: number, patch: Partial<OfferingDraft>) {
    setOfferings(items => items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!profile || profile.role !== "provider") { setError("Для публикации войдите как исполнитель."); return; }
    if (locations.some(point => !point.address.trim() || point.lat === null || point.lng === null)) {
      setError("Укажите адрес каждой точки и отметьте её на карте."); return;
    }
    if (offerings.some(item => !item.name.trim() || !Number.isFinite(Number(item.price)) || Number(item.price) <= 0)) {
      setError("Для каждой услуги укажите название и цену больше нуля."); return;
    }
    if (!acceptsCard && !acceptsCash) { setError("Выберите хотя бы один способ оплаты."); return; }
    setBusy(true);
    try {
      const supabase = await getBrowserClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user.id !== profile.user_id) throw new Error("Сессия истекла. Войдите ещё раз.");
      const points = locations.map(point => ({ address: point.address.trim(), lat: point.lat!, lng: point.lng! }));
      const servicesForDb = offerings.map(item => ({ name: item.name.trim(), price: `${Number(item.price)} BYN` }));
      const { data, error: insertError } = await supabase.from("catalog_entries").insert({
        owner_id: profile.user_id,
        name: name.trim(), kind, provider_type: providerType, category,
        service: servicesForDb[0].name, description: description.trim(), city: city.trim(),
        address: points[0].address, lat: points[0].lat, lng: points[0].lng,
        locations: points, offerings: servicesForDb, brands: selectedBrands.length ? selectedBrands : ["Все марки"],
        price_byn: Number(offerings[0].price), price_label: `от ${Number(offerings[0].price)} BYN`,
        payment_methods: [acceptsCard ? "card" : null, acceptsCash ? "cash" : null].filter(Boolean),
        phone: phone.trim(), around_clock: aroundClock, mobile, urgent,
        open_now: false, available_today: false, promoted: false, is_demo: false, status: "pending",
      }).select("id,name,service,status,created_at").single();
      if (insertError) throw insertError;
      setOwnEntries(current => [data as OwnEntry, ...current]);
      setSuccess(`Объявление №${data.id} отправлено на модерацию. Оно появится в каталоге после проверки.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось отправить объявление."); }
    finally { setBusy(false); }
  }

  const brandMatches = brandQuery.trim()
    ? brands.filter(value => value.toLowerCase().includes(brandQuery.trim().toLowerCase()) && !selectedBrands.includes(value)).slice(0, 8)
    : [];

  return <main className="provider-page"><header className="profile-header"><div className="wrap"><a className="logo" href="/">GEAR<span>.</span></a><a href="/account">Мой профиль</a><a href="/#catalog">Каталог</a></div></header>
    <div className="wrap provider-workspace"><p className="overline">GEAR · Исполнителям</p><h1>Кабинет исполнителя</h1>
      {loading ? <p>Загружаем кабинет…</p> : error && !profile ? <p className="form-error" role="alert">{error}</p> : !profile ? <div className="provider-gate"><h2>Сначала войдите в GEAR</h2><p>Выберите роль «Предоставляю услуги» и подтвердите e-mail по ссылке из письма.</p><a className="black-button" href="/">На главную</a></div> : profile.role !== "provider" ? <div className="provider-gate"><h2>Этот аккаунт зарегистрирован для поиска услуг</h2><p>Роль выбирается при регистрации. Для тестирования кабинета исполнителя нужен отдельный e-mail.</p><a className="outline-button" href="/account">Мой профиль</a></div> : <>
        <p className="provider-intro">Вы вошли как {email}. Заполните карточку услуг и точки работы. Объявление будет видно только вам до проверки модератором.</p>
        {success && <p className="form-success" role="status">{success}</p>}
        <section className="own-list"><h2>Мои объявления</h2>{ownEntries.length ? <div>{ownEntries.map(entry => <article key={entry.id}><span><b>{entry.name}</b><small>{entry.service} · №{entry.id}</small></span><strong className={`entry-status ${entry.status}`}>{statusLabel[entry.status] ?? entry.status}</strong>{entry.status === "published" && <a href={`/service/${entry.id}`}>Открыть</a>}</article>)}</div> : <p>Пока нет объявлений. Создайте первое ниже.</p>}</section>
        <form className="provider-form" onSubmit={submit}><h2>Новое объявление</h2><p className="form-muted">Одна карточка может содержать несколько услуг и точек. Цена каждой услуги одинакова на всех указанных точках.</p>
          <div className="form-grid"><label>Название сервиса или мастера<input required maxLength={100} value={name} onChange={event => setName(event.target.value)} placeholder="Например, Мастерская на Сурганова" /></label><label>Формат работы<select value={kind} onChange={event => setKind(event.target.value)}><option>Автосервис</option><option>Частный мастер</option><option>Выездной специалист</option></select></label></div>
          <fieldset className="provider-radio"><legend>Кто предоставляет услуги?</legend><label><input type="radio" checked={providerType === "private"} onChange={() => setProviderType("private")} /> Частное лицо</label><label><input type="radio" checked={providerType === "legal"} onChange={() => setProviderType("legal")} /> Юридическое лицо</label></fieldset>
          {providerType === "legal" && <p className="form-tip">Для юридического лица проверка документов обязательна до публикации. Загрузка документов будет добавлена отдельно; пока согласуйте проверку с администратором.</p>}
          <label className="form-full">Описание<textarea required minLength={30} maxLength={2000} rows={4} value={description} onChange={event => setDescription(event.target.value)} placeholder="Расскажите, какие задачи решаете, какое оборудование используете и что входит в цену." /></label>
          <div className="form-grid"><label>Категория<select value={category} onChange={event => { setCategory(event.target.value as Category); setOfferings([{ name: "", price: "" }]); }}>{categories.map(item => <option key={item}>{item}</option>)}</select></label><label>Контактный телефон<input required type="tel" value={phone} onChange={event => setPhone(event.target.value)} placeholder="+375 29 123-45-67" /><small>Только для связи по объявлению, не для входа.</small></label></div>
          <section className="form-section"><h3>Услуги и цены</h3><p>Можно выбрать услугу из списка или написать свою. Указывайте цену в BYN.</p><datalist id="gear-service-options">{services[category].map(item => <option key={item} value={item} />)}</datalist>{offerings.map((item, index) => <div className="form-row" key={index}><label>Услуга {index + 1}<input required list="gear-service-options" value={item.name} onChange={event => updateOffering(index, { name: event.target.value })} placeholder="Название услуги" /></label><label>Цена, BYN<input required type="number" min="1" step="1" value={item.price} onChange={event => updateOffering(index, { price: event.target.value })} /></label>{offerings.length > 1 && <button type="button" className="remove-row" aria-label={`Убрать услугу ${index + 1}`} onClick={() => setOfferings(items => items.filter((_, itemIndex) => itemIndex !== index))}><X size={18} /></button>}</div>)}<button type="button" className="add-row" onClick={() => setOfferings(items => [...items, { name: "", price: "" }])}><Plus size={17} /> Добавить услугу</button></section>
          <section className="form-section"><h3>Марки автомобилей</h3><p>{selectedBrands.length ? selectedBrands.join(", ") : "Все марки"}</p><input aria-label="Поиск автомобильной марки" value={brandQuery} onChange={event => setBrandQuery(event.target.value)} placeholder="Найти и добавить марку" /><div className="brand-suggestions">{brandMatches.map(brand => <button type="button" key={brand} onClick={() => { setSelectedBrands(items => [...items, brand]); setBrandQuery(""); }}>{brand}</button>)}</div>{selectedBrands.length > 0 && <div className="selected-brands">{selectedBrands.map(brand => <button type="button" key={brand} onClick={() => setSelectedBrands(items => items.filter(value => value !== brand))}>{brand} <X size={13} /></button>)}</div>}</section>
          <section className="form-section"><h3>Расположение</h3><label>Город или населённый пункт<input required list="gear-cities" value={city} onChange={event => setCity(event.target.value)} /><datalist id="gear-cities">{cities.filter(value => value !== "Вся Беларусь").map(value => <option key={value} value={value} />)}</datalist></label><p>Укажите адрес и нажмите на карте в точном месте. Можно добавить несколько точек.</p>
            <div className="location-tabs">{locations.map((_, index) => <button type="button" className={activeLocation === index ? "active" : ""} key={index} onClick={() => setActiveLocation(index)}><MapPin size={15} /> Точка {index + 1}</button>)}<button type="button" onClick={() => { setLocations(items => [...items, emptyLocation()]); setActiveLocation(locations.length); }}><Plus size={16} /> Добавить точку</button></div>
            {locations.map((point, index) => activeLocation === index && <div className="location-editor" key={index}><label>Адрес точки<input required value={point.address} onChange={event => updateLocation(index, { address: event.target.value })} placeholder="Улица, дом, корпус" /></label><p>{point.lat === null ? "Точка на карте ещё не выбрана" : `Координаты: ${point.lat}, ${point.lng}`}</p>{locations.length > 1 && <button type="button" className="remove-location" onClick={() => { setLocations(items => items.filter((_, itemIndex) => itemIndex !== index)); setActiveLocation(0); }}>Удалить эту точку</button>}</div>)}
            <LocationPicker city={city} locations={locations} activeIndex={activeLocation} onPick={(lat, lng) => updateLocation(activeLocation, { lat, lng })} />
          </section>
          <section className="form-section"><h3>Условия работы</h3><div className="check-grid"><label><input type="checkbox" checked={acceptsCard} onChange={event => setAcceptsCard(event.target.checked)} /> Принимаю карту</label><label><input type="checkbox" checked={acceptsCash} onChange={event => setAcceptsCash(event.target.checked)} /> Принимаю наличные</label><label><input type="checkbox" checked={mobile} onChange={event => setMobile(event.target.checked)} /> Выезд к автомобилю</label><label><input type="checkbox" checked={urgent} onChange={event => setUrgent(event.target.checked)} /> Срочные работы</label><label><input type="checkbox" checked={aroundClock} onChange={event => setAroundClock(event.target.checked)} /> Круглосуточно</label></div></section>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="black-button submit-listing" type="submit" disabled={busy}>{busy ? "Отправляем…" : "Отправить на модерацию"}</button>
        </form>
      </>}
    </div>
  </main>;
}
