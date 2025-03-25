import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { Cloud, CloudRain, Zap } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Mock storm data
const stormCenters = [
  { position: [40.7128, -74.0060], intensity: 0.8, type: 'thunderstorm' },
  { position: [40.8128, -74.2060], intensity: 0.6, type: 'rain' },
  { position: [40.6128, -73.8060], intensity: 0.9, type: 'severe' },
];

function App() {
  const [lightning, setLightning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setLightning(true);
        setTimeout(() => setLightning(false), 200);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStormColor = (type: string) => {
    switch (type) {
      case 'thunderstorm':
        return '#4a90e2';
      case 'rain':
        return '#45aaf2';
      case 'severe':
        return '#eb3b5a';
      default:
        return '#4a90e2';
    }
  };

  const getStormIcon = (type: string) => {
    switch (type) {
      case 'thunderstorm':
        return <Zap className="text-yellow-400" />;
      case 'rain':
        return <CloudRain className="text-blue-400" />;
      case 'severe':
        return <Cloud className="text-red-400" />;
      default:
        return <Cloud className="text-gray-400" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Lightning flash effect */}
      <div 
        className={`absolute inset-0 bg-white z-50 pointer-events-none ${
          lightning ? 'opacity-30' : 'opacity-0'
        } transition-opacity duration-200`}
      />

      <div className="relative z-10 h-screen flex flex-col">
        <div className="p-4 bg-gray-800 text-white">
          <h1 className="text-2xl font-bold">Storm Tracker</h1>
        </div>

        <div className="flex-1 grid grid-cols-4">
          <div className="col-span-3 relative">
            <MapContainer
              center={[40.7128, -74.0060]}
              zoom={10}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {stormCenters.map((storm, index) => (
                <Circle
                  key={index}
                  center={storm.position as [number, number]}
                  radius={storm.intensity * 5000}
                  pathOptions={{
                    color: getStormColor(storm.type),
                    fillColor: getStormColor(storm.type),
                    fillOpacity: 0.3,
                  }}
                >
                  <Popup>
                    <div className="flex items-center gap-2">
                      {getStormIcon(storm.type)}
                      <span className="capitalize">{storm.type}</span>
                    </div>
                    <div>Intensity: {(storm.intensity * 100).toFixed(0)}%</div>
                  </Popup>
                </Circle>
              ))}
            </MapContainer>
          </div>

          <div className="bg-gray-800 p-4 text-white">
            <h2 className="text-xl font-semibold mb-4">Storm Details</h2>
            <div className="space-y-4">
              {stormCenters.map((storm, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getStormIcon(storm.type)}
                    <span className="capitalize font-medium">{storm.type}</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <p>Lat: {storm.position[0].toFixed(4)}</p>
                    <p>Lon: {storm.position[1].toFixed(4)}</p>
                    <p>Intensity: {(storm.intensity * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;