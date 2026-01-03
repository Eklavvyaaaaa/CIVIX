
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Report } from '../types';

interface MapProps {
  reports: Report[];
  center: [number, number];
  zoom: number;
}

const Map: React.FC<MapProps> = ({ reports, center, zoom }) => {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map(report => (
        <Marker key={report.id} position={[report.location.lat, report.location.lng]}>
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold">{report.title}</h3>
              <p>{report.category}</p>
              <p className="text-sm text-gray-600">{report.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
