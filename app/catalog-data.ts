import { categories, brands, models, services, type Category } from "./catalog-taxonomy";
export { categories, brands, models, services };
export type { Category };
export type City = string;
export type Payment = "card" | "cash";
export type Provider = {
  id: number;
  name: string;
  category: Category;
  service: string;
  city: City;
  address: string;
  lat: number;
  lng: number;
  brands: string[];
  price: number;
  priceLabel: string;
  promoted: boolean;
  openNow: boolean;
  availableToday: boolean;
  aroundClock: boolean;
  mobile: boolean;
  urgent: boolean;
  payment: Payment[];
  phone: string;
  createdAt: number;
  isDemo?: boolean;
  supportedModels?: Record<string, string[]>;
  description?: string;
  offerings?: { name: string; price: string }[];
  locations?: { address: string; lat: number; lng: number }[];
  kind?: "Автосервис" | "Частный мастер" | "Выездной специалист";
};

// Демонстрационные исполнители: данные будут заменены реальными публикациями.
export const providers: Provider[] = [
  {id:1,name:"МоторХаус",category:"Диагностика",service:"Компьютерная диагностика BMW",city:"Минск",address:"Минск, район Партизанского проспекта",lat:53.887,lng:27.628,brands:["BMW","Audi"],price:35,priceLabel:"от 35 BYN",promoted:true,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"+375 29 111-22-33",createdAt:7,description:"Компьютерная диагностика, проверка аккумулятора и поиск ошибок электронных блоков. Помогаем определить причину поломки перед ремонтом.",offerings:[{name:"Компьютерная диагностика",price:"от 35 BYN"},{name:"Проверка аккумулятора",price:"от 20 BYN"},{name:"Диагностика двигателя",price:"от 45 BYN"}],locations:[{address:"Минск, район Партизанского проспекта",lat:53.887,lng:27.628},{address:"Минск, район улицы Орловской",lat:53.927,lng:27.543}],kind:"Автосервис"},
  {id:2,name:"Автодоктор 24",category:"Диагностика",service:"Выездная диагностика автомобиля",city:"Минск",address:"Минск, выезд по городу",lat:53.906,lng:27.558,brands:["BMW","Audi","Volkswagen","Toyota"],price:50,priceLabel:"от 50 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:true,mobile:true,urgent:true,payment:["cash"],phone:"+375 33 333-44-55",createdAt:8},
  {id:3,name:"Garage 17",category:"Диагностика",service:"Диагностика перед покупкой",city:"Минск",address:"Минск, район Кальварийской улицы",lat:53.908,lng:27.513,brands:["BMW","Mercedes-Benz"],price:40,priceLabel:"40–70 BYN",promoted:false,openNow:false,availableToday:false,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"+375 25 444-55-66",createdAt:6},
  {id:4,name:"СканАвто",category:"Диагностика",service:"Диагностика двигателя и электроники",city:"Минск",address:"Минск, район Логойского тракта",lat:53.949,lng:27.616,brands:["BMW","Volkswagen","Toyota"],price:45,priceLabel:"45 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"+375 44 222-33-44",createdAt:5},
  {id:5,name:"ЭлектроПлюс",category:"Автоэлектрика",service:"Ремонт электрики и поиск неисправностей",city:"Минск",address:"Минск, район улицы Аэродромной",lat:53.862,lng:27.538,brands:["BMW","Audi","Toyota"],price:60,priceLabel:"от 60 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:true,payment:["card"],phone:"+375 29 555-66-77",createdAt:9},
  {id:6,name:"Колесо Сервис",category:"Шиномонтаж",service:"Сезонный шиномонтаж",city:"Минск",address:"Минск, район улицы Притыцкого",lat:53.908,lng:27.472,brands:["Все марки"],price:30,priceLabel:"от 30 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"+375 33 666-77-88",createdAt:4},
  {id:7,name:"МоторЛаб",category:"Ремонт двигателя",service:"Ремонт двигателя и ГРМ",city:"Минск",address:"Минск, район улицы Кабушкина",lat:53.853,lng:27.619,brands:["BMW","Mercedes-Benz","Volkswagen"],price:150,priceLabel:"от 150 BYN",promoted:false,openNow:false,availableToday:false,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"+375 29 777-88-99",createdAt:3},
  {id:8,name:"КузовПро",category:"Кузовной ремонт",service:"Рихтовка и покраска кузова",city:"Минск",address:"Минск, район улицы Казинца",lat:53.849,lng:27.526,brands:["Все марки"],price:120,priceLabel:"от 120 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"+375 44 888-99-00",createdAt:2},
  {id:9,name:"ТО Парк",category:"Техническое обслуживание",service:"Замена масла и фильтров",city:"Минск",address:"Минск, район улицы Орловской",lat:53.927,lng:27.543,brands:["BMW","Audi","Toyota"],price:40,priceLabel:"от 40 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card"],phone:"+375 25 999-00-11",createdAt:10},
  {id:10,name:"Гомель Диагностик",category:"Диагностика",service:"Компьютерная диагностика автомобилей",city:"Гомель",address:"Гомель, Центральный район",lat:52.434,lng:30.975,brands:["BMW","Volkswagen","Все марки"],price:32,priceLabel:"от 32 BYN",promoted:true,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"+375 29 101-12-13",createdAt:11},
  {id:11,name:"Брест АвтоПрофи",category:"Диагностика",service:"Диагностика перед ремонтом",city:"Брест",address:"Брест, Московский район",lat:52.101,lng:23.698,brands:["BMW","Audi","Все марки"],price:38,priceLabel:"от 38 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["cash"],phone:"+375 33 202-23-24",createdAt:12},
  {id:12,name:"Гродно Мастер",category:"Шиномонтаж",service:"Шиномонтаж и балансировка",city:"Гродно",address:"Гродно, Ленинский район",lat:53.677,lng:23.83,brands:["Все марки"],price:28,priceLabel:"от 28 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"+375 44 303-34-35",createdAt:13},
  {id:13,name:"Витебск Электро",category:"Автоэлектрика",service:"Диагностика и ремонт автоэлектрики",city:"Витебск",address:"Витебск, Октябрьский район",lat:55.191,lng:30.206,brands:["BMW","Volkswagen","Все марки"],price:55,priceLabel:"от 55 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:true,payment:["card","cash"],phone:"+375 25 404-45-46",createdAt:14},
  {id:14,name:"Могилёв АвтоСкан",category:"Диагностика",service:"Компьютерная диагностика",city:"Могилёв",address:"Могилёв, Ленинский район",lat:53.901,lng:30.336,brands:["BMW","Toyota","Все марки"],price:34,priceLabel:"от 34 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["cash"],phone:"+375 29 505-56-57",createdAt:15},
  {id:15,name:"Климат Авто",category:"Кондиционеры и отопление",service:"Заправка и ремонт кондиционера",city:"Минск",address:"Минск, район улицы Тимирязева",lat:53.922,lng:27.515,brands:["Все марки"],price:65,priceLabel:"от 65 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"",createdAt:16,description:"Заправка кондиционера, поиск утечки и диагностика климат-контроля.",kind:"Автосервис"},
  {id:16,name:"СтеклоПрофи",category:"Автостёкла",service:"Замена лобового стекла и ремонт сколов",city:"Брест",address:"Брест, район улицы Московской",lat:52.106,lng:23.733,brands:["Все марки"],price:75,priceLabel:"от 75 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"",createdAt:17,description:"Ремонт сколов, трещин и замена автомобильных стёкол.",kind:"Автосервис"},
  {id:17,name:"Мастер на дороге",category:"Выездная помощь",service:"Запуск двигателя и помощь с аккумулятором",city:"Минск",address:"Минск, выезд по городу",lat:53.899,lng:27.58,brands:["Все марки"],price:45,priceLabel:"от 45 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:true,mobile:true,urgent:true,payment:["cash"],phone:"",createdAt:18,description:"Выездная помощь: севший аккумулятор, запуск двигателя, замена колеса на месте.",kind:"Выездной специалист"},
  {id:18,name:"Детейлинг Лаб",category:"Мойка и детейлинг",service:"Химчистка и полировка автомобиля",city:"Гродно",address:"Гродно, район улицы Победы",lat:53.674,lng:23.864,brands:["Все марки"],price:90,priceLabel:"от 90 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"",createdAt:19,description:"Химчистка салона, полировка кузова и защитное покрытие.",kind:"Автосервис"},
  {id:19,name:"Ключ Мастер",category:"Сигнализации, ключи и замки",service:"Изготовление и программирование автомобильных ключей",city:"Витебск",address:"Витебск, район проспекта Строителей",lat:55.177,lng:30.211,brands:["Все марки"],price:40,priceLabel:"от 40 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:true,payment:["cash"],phone:"",createdAt:20,description:"Ключи, сигнализации, замки и иммобилайзеры.",kind:"Частный мастер"},
  {id:20,name:"АвтоИндивидуал",category:"Другое",service:"Установка дополнительного оборудования",city:"Гомель",address:"Гомель, Советский район",lat:52.421,lng:30.958,brands:["Все марки"],price:55,priceLabel:"от 55 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"",createdAt:21,description:"Нестандартные задачи и индивидуальная доработка автомобиля. Установка видеорегистратора, камеры заднего вида и дополнительного оборудования.",kind:"Частный мастер"},
  {id:21,name:"Масло Плюс",category:"Замена масла и жидкостей",service:"Замена масла в двигателе и коробке передач",city:"Минск",address:"Минск, район улицы Железнодорожной",lat:53.874,lng:27.521,brands:["Все марки"],price:35,priceLabel:"от 35 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"",createdAt:22,description:"Замена моторного масла, масла в АКПП и МКПП, антифриза и тормозной жидкости.",kind:"Автосервис"},
  {id:22,name:"ТрансМастер",category:"Трансмиссия и сцепление",service:"Ремонт коробки передач и замена сцепления",city:"Могилёв",address:"Могилёв, район проспекта Мира",lat:53.91,lng:30.344,brands:["Все марки"],price:130,priceLabel:"от 130 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"",createdAt:23,description:"Диагностика и ремонт АКПП, МКПП, вариатора, сцепления и привода.",kind:"Автосервис"},
  {id:23,name:"Ходовая Сервис",category:"Подвеска, тормоза и рулевое",service:"Ремонт подвески, тормозов и рулевого управления",city:"Брест",address:"Брест, район улицы Суворова",lat:52.083,lng:23.719,brands:["Все марки"],price:45,priceLabel:"от 45 BYN",promoted:false,openNow:true,availableToday:true,aroundClock:false,mobile:false,urgent:false,payment:["card","cash"],phone:"",createdAt:24,description:"Замена амортизаторов, колодок и тормозных дисков, ремонт рулевой рейки, развал-схождение.",kind:"Автосервис"},
];

export const cities: (City | "Вся Беларусь")[] = ["Минск","Гомель","Могилёв","Витебск","Гродно","Брест","Вся Беларусь"];
export const cityCenters: Record<City | "Вся Беларусь",[number,number]> = {"Минск":[53.9006,27.559],"Гомель":[52.4345,30.9754],"Могилёв":[53.9007,30.3314],"Витебск":[55.1848,30.2016],"Гродно":[53.6778,23.8295],"Брест":[52.0976,23.7341],"Вся Беларусь":[53.7,27.9]};
