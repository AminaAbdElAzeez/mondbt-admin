import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

interface School {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  address: string;
}

interface SchoolsMapProps {
  schools: School[];
  selectedSchoolId: number | null;
  onSelectSchool: (id: number) => void;
}

const SchoolsMap: React.FC<SchoolsMapProps> = ({
  schools,
  selectedSchoolId,
  onSelectSchool,
}) => {
  const defaultPosition: [number, number] = [24.7743, 46.6753]; // مركز افتراضي

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (selectedSchoolId) {
        const school = schools.find((s) => s.id === selectedSchoolId);
        if (school) {
          const lat = parseFloat(school.latitude);
          const lng = parseFloat(school.longitude);
          map.flyTo([lat, lng], 15, { duration: 1.5 });
        }
      }
    }, [selectedSchoolId]);
    return null;
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const icon = new L.Icon({
    iconUrl: "/marker-icon.png",
    iconRetinaUrl: "/marker-icon-2x.png",
    iconSize: isMobile ? [20, 30] : [25, 41],
    iconAnchor: isMobile ? [10, 30] : [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/marker-shadow.png",
    shadowSize: isMobile ? [30, 30] : [41, 41],
  });

  return (
    <MapContainer
      center={[24.7743, 46.6753]}
      zoom={6}
      style={{ height: "400px", width: "100%" }}
      className=" relative !z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {schools.map((school) => (
        <Marker
          key={school.id}
          position={[parseFloat(school.latitude), parseFloat(school.longitude)]}
          icon={icon}
        >
          <Popup>{school.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default SchoolsMap;
