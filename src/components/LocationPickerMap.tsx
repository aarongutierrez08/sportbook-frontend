import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
    lat?: number;
    lng?: number;
    onChange: (lat: number, lng: number, placeName?: string) => void;
}

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ lat, lng, onChange }) => {
    const [marker, setMarker] = useState<[number, number] | null>(
        lat && lng ? [lat, lng] : null
    );
    const [address, setAddress] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const MapClickHandler = () => {
        const map = useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setMarker([lat, lng]);
                onChange(lat, lng);
                map.flyTo([lat, lng], map.getZoom()); // mover el mapa al punto clickeado
            },
        });
        return null;
    };

    useEffect(() => {
        if (address.length < 3) {
            setSuggestions([]);
            return;
        }

        const controller = new AbortController();

        const fetchSuggestions = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_OPEN_STREET_API_URL}search?format=json&addressdetails=1&q=${encodeURIComponent(
                        address
                    )}`,
                    { signal: controller.signal, headers: { "Accept-Language": "es" } }
                );
                const data = await res.json();
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (err) {
                if ((err as any).name !== "AbortError") console.error(err);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 400);
        return () => {
            clearTimeout(debounce);
            controller.abort();
        };
    }, [address]);

    const MapFlyTo: React.FC<{ coords: [number, number] | null }> = ({ coords }) => {
        const map = useMap();
        useEffect(() => {
            if (coords) {
                map.flyTo(coords, 15); // zoom 15 para ver la ubicación de cerca
            }
        }, [coords, map]);
        return null;
    };

    const handleSelectSuggestion = (s: any) => {
        const lat = parseFloat(s.lat);
        const lng = parseFloat(s.lon);
        setMarker([lat, lng]);
        setAddress(s.display_name);
        setShowSuggestions(false);
        setSuggestions([]);
        onChange(lat, lng, s.display_name);
    };

    return (
        <div className="mini-map">
            <div className="form-group form-full" style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Ingresar dirección"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                />
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="autocomplete-list">
                        {suggestions.map((s, idx) => (
                            <li key={idx} onClick={() => handleSelectSuggestion(s)}>
                                {s.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <MapContainer
                center={marker ?? [-34.6037, -58.3816]}
                zoom={13}
                style={{ width: "100%", height: "250px", borderRadius: "12px" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler />
                <MapFlyTo coords={marker} />
                {marker && (
                    <Marker
                        position={marker}
                        icon={L.icon({
                            iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                            iconSize: [28, 28],
                            iconAnchor: [14, 28],
                        })}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default LocationPickerMap;
