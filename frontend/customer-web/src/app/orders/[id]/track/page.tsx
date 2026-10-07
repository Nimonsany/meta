"use client";

import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function OrderTrackPage({
  params,
}: { params: { id: string } }) {
  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style: {
        version: 8,
        sources: {
          basic: {
            type: "raster",
            url: "/tiles/styles/basic-preview/{z}/{x}/{y}.png",
          },
        },
        layers: [
          {
            id: "basic",
            type: "raster",
            source: "basic",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [34.5553, 31.9420],
      zoom: 12,
    });

    map.on("load", () => {
      map.addControl(new maplibregl.NavigationControl());

      // Socket.io tracking
      const socket = new WebSocket("ws://localhost:3000");
      socket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        const lng: number = data.lng;
        const lat: number = data.lat;
        const coordinate: [number, number] = [lng, lat];
        map.flyTo({
          duration: 1000,
          center: coordinate,
        });
        new maplibregl.Marker()
          .setLngLat(coordinate)
          .setPopup(
            new maplibregl.Popup().setText(`Order ${data.orderId}`)
          )
          .addTo(map);
      };
    });

    return () => {
      map.destroy();
    };
  }, [params.id]);

  return (
    <div id="map" style={{ height: "100%", width: "100%" }}></div>
  );
}