"use client";
import ServiceMap from "../../service-map";
import type { Provider } from "../../catalog-data";

export default function ProviderMap({provider}:{provider:Provider}) {
  const points=provider.locations??[{address:provider.address,lat:provider.lat,lng:provider.lng}];
  return <ServiceMap city={provider.city} items={points.map((point,index)=>({...provider,id:provider.id*100+index,address:point.address,lat:point.lat,lng:point.lng}))} onOpen={id=>document.getElementById(`location-${id-provider.id*100}`)?.scrollIntoView({behavior:"smooth",block:"center"})}/>;
}
