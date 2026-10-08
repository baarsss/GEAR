"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { cityCenters } from "@/app/catalog-data";

export type LocationDraft = { address: string; lat: number | null; lng: number | null };

export default function LocationPicker({ city, locations, activeIndex, onPick }: {
  city: string;
  locations: LocationDraft[];
  activeIndex: number;
  onPick: (lat: number, lng: number) => void;
}) {
  const element = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const [ready, setReady] = useState(0);
  const pick = useRef(onPick);
  pick.current = onPick;

  useEffect(() => {
    if (!element.current) return;
    let cancelled = false;
    let currentMap: LeafletMap | null = null;
    import("leaflet").then(L => {
      if (cancelled || !element.current) return;
      const center = cityCenters[city] ?? cityCenters["Вся Беларусь"];
      currentMap = L.map(element.current, { scrollWheelZoom: false }).setView(center, cityCenters[city] ? 12 : 7);
      map.current = currentMap;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(currentMap);
      currentMap.on("click", event => pick.current(Number(event.latlng.lat.toFixed(6)), Number(event.latlng.lng.toFixed(6))));
      setReady(value => value + 1);
      requestAnimationFrame(() => currentMap?.invalidateSize());
    });
    return () => { cancelled = true; currentMap?.remove(); map.current = null; };
  }, [city]);

  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap) return;
    let cancelled = false;
    import("leaflet").then(L => {
      if (cancelled || !map.current) return;
      map.current.eachLayer(layer => { if (layer instanceof L.CircleMarker) map.current?.removeLayer(layer); });
      locations.forEach((point, index) => {
        if (point.lat === null || point.lng === null) return;
        L.circleMarker([point.lat, point.lng], {
          radius: index === activeIndex ? 11 : 8,
          color: "#111", weight: 2, fillColor: index === activeIndex ? "#9bd636" : "#fff", fillOpacity: 1,
        }).addTo(map.current!).bindTooltip(`Точка ${index + 1}`);
      });
    });
    return () => { cancelled = true; };
  }, [locations, activeIndex, ready]);

  return <div className="provider-location-map" ref={element} aria-label="Выберите точку на карте" />;
}
