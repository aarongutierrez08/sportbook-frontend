import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MiniMapProps {
    lat: number;
    lng: number;
}

const FixMapSize = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    }, [map]);
    return null;
};

const MiniMap: React.FC<MiniMapProps> = ({ lat, lng }) => {
    return (
        <div className="mini-map">
            <MapContainer
                center={[lat, lng]}
                zoom={14}
                scrollWheelZoom={false}
                className="mini-map-container"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                    position={[lat, lng]}
                    icon={L.icon({
                        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                        iconSize: [28, 28],
                        iconAnchor: [14, 28],
                    })}
                >
                    <Popup>Ubicación del evento</Popup>
                </Marker>

                <FixMapSize />
            </MapContainer>
        </div>
    );
};

export default MiniMap;
