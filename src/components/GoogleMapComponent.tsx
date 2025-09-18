import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../contexts/DataContext';

interface GoogleMapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    status: 'pending' | 'verified' | 'rejected';
    onClick?: () => void;
  }>;
  height?: string;
  zoom?: number;
  readonly?: boolean;
}

export default function GoogleMapComponent({
  onLocationSelect,
  initialLocation,
  markers = [],
  height = '400px',
  zoom = 16,
  readonly = false
}: GoogleMapComponentProps) {
  const { systemSettings } = useData();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<google.maps.Marker | null>(null);

  // Default center for Barangay San Miguel, Metro Manila
  const defaultCenter = { lat: 14.5995, lng: 120.9842 };

  // Global loading state to prevent multiple script loads
  const isGoogleMapsLoading = useRef(false);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (!systemSettings.googleMapsApiKey) {
        setError('Google Maps API key not configured. Please contact administrator.');
        return;
      }

      // Check if script is already in the document
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        initializeMap();
        return;
      }

      // Prevent multiple simultaneous loads
      if (isGoogleMapsLoading.current) {
        // Wait for the current load to complete
        const checkLoaded = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkLoaded);
            initializeMap();
          }
        }, 100);
        return;
      }

      try {
        isGoogleMapsLoading.current = true;
        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${systemSettings.googleMapsApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          isGoogleMapsLoading.current = false;
          initializeMap();
        };
        script.onerror = () => {
          isGoogleMapsLoading.current = false;
          setError('Failed to load Google Maps. Please check your internet connection.');
        };
        document.head.appendChild(script);
      } catch (err) {
        isGoogleMapsLoading.current = false;
        setError('Error loading Google Maps API');
        console.error('Google Maps loading error:', err);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      try {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: initialLocation || defaultCenter,
          zoom: zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });

        setMap(mapInstance);
        setIsLoaded(true);

        // Add click listener for location selection (only if not readonly)
        if (!readonly) {
          mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();
              
              // Reverse geocode to get address
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  onLocationSelect({
                    lat,
                    lng,
                    address: results[0].formatted_address
                  });
                } else {
                  onLocationSelect({
                    lat,
                    lng,
                    address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                  });
                }
              });
            }
          });
        }
      } catch (err) {
        setError('Error initializing map');
        console.error('Map initialization error:', err);
      }
    };

    loadGoogleMaps();
  }, [systemSettings.googleMapsApiKey, initialLocation, zoom, readonly, onLocationSelect]);

  // Add markers when map is loaded
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear existing markers
    // In a real implementation, you'd track markers to clear them

    markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: map,
        title: markerData.title,
        icon: {
          url: getMarkerIcon(markerData.status),
          scaledSize: new google.maps.Size(32, 32)
        }
      });

      if (markerData.onClick) {
        marker.addListener('click', markerData.onClick);
      }

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h4 style="margin: 0 0 8px 0; font-weight: bold;">${markerData.title}</h4>
            <p style="margin: 0; font-size: 12px; color: #666;">
              Status: <span style="font-weight: bold; color: ${getStatusColor(markerData.status)};">
                ${markerData.status.toUpperCase()}
              </span>
            </p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });
  }, [map, isLoaded, markers]);

  const getMarkerIcon = (status: string) => {
    // Return data URLs for colored markers
    switch (status) {
      case 'verified':
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#10B981" stroke="white" stroke-width="2"/>
            <path d="M12 16l3 3 6-6" stroke="white" stroke-width="2" fill="none"/>
          </svg>
        `);
      case 'rejected':
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="white" stroke-width="2"/>
            <path d="M12 12l8 8M20 12l-8 8" stroke="white" stroke-width="2"/>
          </svg>
        `);
      default:
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#F59E0B" stroke="white" stroke-width="2"/>
            <circle cx="16" cy="16" r="3" fill="white"/>
          </svg>
        `);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return '#10B981';
      case 'rejected':
        return '#EF4444';
      default:
        return '#F59E0B';
    }
  };

  if (error) {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center" style={{ height }}>
        <div className="text-red-600">
          <h3 className="font-semibold mb-2">Map Loading Error</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-300" style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google: any;
  }
}