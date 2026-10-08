"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { Provider } from "./catalog-data";
import { cityCenters, type City } from "./catalog-data";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[character]!);

type Props = {
  items: Provider[];
  city: City | "Вся Беларусь";
  onOpen: (id: number) => void;
};

export default function ServiceMap({ items, city, onOpen }: Props) {
  const element = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const callback = useRef(onOpen);
  callback.current = onOpen;

  useEffect(() => {
    if (!element.current) return;
    let cancelled = false;
    let markerLayer: import("leaflet").LayerGroup | null = null;
    let currentMap: LeafletMap | null = null;

    import("leaflet").then((L) => {
      if (cancelled || !element.current) return;
      const center = cityCenters[city] ?? (items.length ? [items[0].lat, items[0].lng] as [number,number] : cityCenters["Вся Беларусь"]);
      currentMap = L.map(element.current, { scrollWheelZoom: false }).setView(center, city === "Вся Беларусь" ? 7 : 12);
      map.current = currentMap;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(currentMap);
      markerLayer = L.layerGroup().addTo(currentMap);
      items.forEach((item) => {
        const icon = L.divIcon({
          className: "gear-map-icon",
          html: `<span class="${item.promoted ? "promoted-map-pin" : ""}">${escapeHtml(item.priceLabel)}</span>`,
          iconSize: [92, 38],
          iconAnchor: [46, 38],
        });
        L.marker([item.lat, item.lng], { icon })
          .addTo(markerLayer!)
          .bindTooltip(escapeHtml(item.name), { direction: "top" })
          .on("click", () => callback.current(item.id));
      });
      if (items.length > 1) {
        currentMap.fitBounds(L.latLngBounds(items.map((item) => [item.lat, item.lng])), { padding: [35, 35], maxZoom: 12 });
      }
      requestAnimationFrame(() => currentMap?.invalidateSize());
    });

    return () => {
      cancelled = true;
      markerLayer?.clearLayers();
      currentMap?.remove();
      map.current = null;
    };
  }, [city, items]);

  return <div className="real-map" ref={element} role="region" aria-label="Карта исполнителей" />;
}
