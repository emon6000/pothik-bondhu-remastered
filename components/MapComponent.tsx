import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import { districts } from '../data/districts';
import { District } from '../types';

interface MapComponentProps {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  onRouteFound?: (distance: number, duration: number) => void;
  onIntermediatesFound?: (districts: District[]) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  startLat, 
  startLng, 
  endLat, 
  endLng, 
  onRouteFound,
  onIntermediatesFound 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Helper: Calculate Haversine distance in meters
  const calcDirectDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Helper: Find intermediate districts based on a set of points (route or line)
  const findIntermediates = (points: {lat: number, lng: number}[]) => {
    const THRESHOLD_SQ = 0.0225; // ~15km squared degrees approx
    
    return districts
      .filter(d => {
         // Exclude start and end districts
         const isStart = Math.abs(d.coordinates.lat - startLat) < 0.05 && Math.abs(d.coordinates.lng - startLng) < 0.05;
         const isEnd = Math.abs(d.coordinates.lat - endLat) < 0.05 && Math.abs(d.coordinates.lng - endLng) < 0.05;
         return !isStart && !isEnd;
      })
      .map(d => {
        let minSqDist = Infinity;
        let closestIndex = -1;
        
        // Check distance to route points (sampling for performance if needed, but 64 districts is low count)
        // We skip points for speed if route is huge, but here we iterate
        const step = Math.max(1, Math.floor(points.length / 100)); // check at most 100 points or all
        
        for (let i = 0; i < points.length; i += step) {
            const p = points[i];
            const dLat = p.lat - d.coordinates.lat;
            const dLng = p.lng - d.coordinates.lng;
            const sqDist = dLat*dLat + dLng*dLng;
            if (sqDist < minSqDist) {
              minSqDist = sqDist;
              closestIndex = i;
            }
        }
        return { ...d, minSqDist, closestIndex };
      })
      .filter(d => d.minSqDist < THRESHOLD_SQ)
      .sort((a, b) => a.closestIndex - b.closestIndex);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // cleanup previous map instance if it exists
    if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
    }

    // Initialize Map
    // Approximate bounds for Bangladesh with some padding
    const southWest = L.latLng(20.0, 87.5);
    const northEast = L.latLng(27.0, 93.0);
    const bounds = L.latLngBounds(southWest, northEast);

    const map = L.map(mapContainerRef.current, {
      maxBounds: bounds,
      maxBoundsViscosity: 1.0, 
      minZoom: 6
    }).setView([23.6850, 90.3563], 7);

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Fix for map loading tiles correctly
    setTimeout(() => {
        map.invalidateSize();
    }, 200);

    // Custom Icons
    const startIcon = L.divIcon({
      className: 'bg-transparent',
      html: '<div style="background-color: #4f46e5; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const endIcon = L.divIcon({
      className: 'bg-transparent',
      html: '<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Add Markers
    const startMarker = L.marker([startLat, startLng], { icon: startIcon }).addTo(map);
    const endMarker = L.marker([endLat, endLng], { icon: endIcon }).addTo(map);

    const group = new L.FeatureGroup([startMarker, endMarker]);
    map.fitBounds(group.getBounds().pad(0.1));

    // Fetch Route
    const fetchRoute = async () => {
      try {
        // Use a more stable OSRM mirror (openstreetmap.de)
        const response = await fetch(
          `https://routing.openstreetmap.de/routed-car/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          
          if (onRouteFound) {
            onRouteFound(route.distance, route.duration);
          }

          const coordinates = route.geometry.coordinates; // [[lng, lat], ...]
          const routePoints = coordinates.map((c: number[]) => ({ lng: c[0], lat: c[1] }));

          if (onIntermediatesFound) {
             const passing = findIntermediates(routePoints);
             onIntermediatesFound(passing);
          }

          // Draw Route
          const latLngs = coordinates.map((coord: number[]) => [coord[1], coord[0]]); // Flip to [lat, lng]
          
          const polyline = L.polyline(latLngs, {
            color: '#6366f1',
            weight: 5,
            opacity: 0.7,
            lineCap: 'round'
          }).addTo(map);
          
          map.fitBounds(polyline.getBounds().pad(0.1));
        } else {
           throw new Error("No route found in response");
        }
      } catch (err) {
        console.warn("Routing API failed, using fallback:", err);
        
        // FALLBACK LOGIC
        // 1. Calculate direct distance
        const directMeters = calcDirectDistance(startLat, startLng, endLat, endLng);
        // 2. Estimate duration (assuming ~50km/h average speed on straight line to account for roads)
        const estimatedSeconds = directMeters / 13.88; // 50km/h in m/s

        if (onRouteFound) {
            onRouteFound(directMeters * 1.3, estimatedSeconds * 1.3); // Add 30% buffer for road winding
        }

        // 3. Draw fallback straight line
        const fallbackPolyline = L.polyline([[startLat, startLng], [endLat, endLng]], {
           color: '#94a3b8',
           dashArray: '10, 10',
           weight: 3
        }).addTo(map);
        
        // 4. Calculate intermediates based on straight line interpolation
        if (onIntermediatesFound) {
            const numSteps = 20;
            const linePoints = [];
            for (let i = 0; i <= numSteps; i++) {
                const t = i / numSteps;
                linePoints.push({
                    lat: startLat + t * (endLat - startLat),
                    lng: startLng + t * (endLng - startLng)
                });
            }
            const passing = findIntermediates(linePoints);
            onIntermediatesFound(passing);
        }
      }
    };

    fetchRoute();

    // Cleanup function
    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };

  }, [startLat, startLng, endLat, endLng]); // Re-run if coordinates change

  return <div ref={mapContainerRef} className="w-full h-full rounded-2xl z-0 transition-all duration-300 dark:filter dark:invert dark:hue-rotate-180 dark:brightness-95 dark:contrast-90" />;
};

export default MapComponent;