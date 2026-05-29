'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getCityCoord } from '@/lib/city-coords'

interface AlumniCity {
  kota: string
  count: number
}

interface AlumniKecamatan {
  kecamatan: string
  count: number
}

interface MapClientProps {
  data: AlumniCity[] | AlumniKecamatan[]
  mode: 'city' | 'kecamatan'
  onMarkerClick?: (name: string, count: number) => void
}

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

export default function MapClient({ data, mode, onMarkerClick }: MapClientProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Layer[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const defaultCenter: [number, number] = [-7.5333, 110.5958]
    const map = L.map(containerRef.current, {
      center: defaultCenter,
      zoom: 10,
      minZoom: 5,
      maxZoom: 14,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    if (!data || data.length === 0) return

    const bounds = L.latLngBounds([])

    data.forEach((item) => {
      const name = mode === 'city' ? (item as AlumniCity).kota : (item as AlumniKecamatan).kecamatan
      const count = item.count

      const coords = getCityCoord(name)
      bounds.extend(coords)

      const size = Math.max(8, Math.min(30, Math.sqrt(count) * 3))

      const marker = L.circleMarker(coords, {
        radius: size,
        fillColor: '#2563eb',
        color: '#1d4ed8',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.6,
      }).addTo(map)

      marker.bindPopup(
        `<div style="font-family:sans-serif;padding:4px">
          <strong style="font-size:14px">${name}</strong><br/>
          <span style="font-size:13px;color:#666">${count} alumni</span>
        </div>`,
      )

      marker.on('click', () => {
        onMarkerClick?.(name, count)
      })

      markersRef.current.push(marker)
    })

    if (data.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 })
    }
  }, [data, mode, onMarkerClick])

  return <div ref={containerRef} className="w-full h-full rounded-lg" />
}
