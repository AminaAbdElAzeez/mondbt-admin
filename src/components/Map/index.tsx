import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch } from "react-redux";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import { fetchLatLngSuccess } from "store/map/actions";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "antd";

interface MapProps {
  onConfirm: (address: string) => void;
}

const Map: React.FC<MapProps> = ({ onConfirm }) => {
  const center = { lat: 23.8859, lng: 45.0792 };
  const [position, setPosition] = useState(center);
  const markerRef = useRef<L.Marker>(null);
  const mapRef = useRef<L.Map | null>(null);
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  // Custom Marker Icon
  const customIcon = new L.Icon({
    iconUrl: (markerIcon as any).default || markerIcon,
    shadowUrl: (markerShadow as any).default || markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const { locale } = useIntl();
  const intl = useIntl();

  // Fetch Address for Selected Coordinates
  const fetchAddress = async (lat: number, lng: number) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "Accept-Language": locale,
        },
      }
    );
    const data = await response.json();
    const address = data?.display_name || "Unknown location";
    setSelectedAddress(address);
    console.log("Address:", address);
    console.log("Address'LatLng:", lat, lng);
    dispatch(fetchLatLngSuccess({ lat: `${lat}`, lng: `${lng}` }));
    mapRef.current?.openPopup(
      L.popup().setLatLng([lat, lng]).setContent(`${address}`)
    );
  };

  // Drag Event Handler for Marker
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
          fetchAddress(newPos.lat, newPos.lng);
        }
      },
    }),
    []
  );

  // Search Control Component
  // const SearchControl: React.FC = () => {
  //   const map = useMap();

  //   useEffect(() => {
  //     if (!map) return;
  //     mapRef.current = map;

  //     const provider = new OpenStreetMapProvider();
  //     const searchControl = new (GeoSearchControl as any)({
  //       provider,
  //       style: "bar",
  //       showMarker: false,
  //       showPopup: false,
  //       keepResult: true,
  //     });

  //     map.addControl(searchControl);

  //     map.on("geosearch/showlocation", (result: any) => {
  //       const { x, y } = result.location;
  //       setPosition({ lat: y, lng: x });

  //       // Move the marker to the searched location
  //       if (markerRef.current) {
  //         markerRef.current.setLatLng([y, x]);
  //       }

  //       fetchAddress(y, x);
  //     });

  //     return () => {
  //       map.removeControl(searchControl);
  //     };
  //   }, [map]);

  //   return null;
  // };
  const SearchControl: React.FC = () => {
    const map = useMap();
    const isEventListenerAttached = useRef(false); // Track event listener

    useEffect(() => {
      if (!map || isEventListenerAttached.current) return; // Prevent duplicate listeners

      mapRef.current = map;
      isEventListenerAttached.current = true; // Mark as attached

      const provider = new OpenStreetMapProvider();
      const searchControl = new (GeoSearchControl as any)({
        provider,
        style: "bar",
        showMarker: false,
        showPopup: false,
        keepResult: true,
        searchLabel: intl.formatMessage({
          id: "searchLocation",
        }),
      });

      map.addControl(searchControl);

      // Handle search location event
      const handleSearchLocation = (result: any) => {
        const { x, y } = result.location;
        setPosition({ lat: y, lng: x });

        if (markerRef.current) {
          markerRef.current.setLatLng([y, x]);
        }

        fetchAddress(y, x);
      };

      map.on("geosearch/showlocation", handleSearchLocation);

      return () => {
        map.removeControl(searchControl);
        map.off("geosearch/showlocation", handleSearchLocation);
        isEventListenerAttached.current = false; // Reset when component unmounts
      };
    }, [map, intl]);

    return null;
  };

  return (
    <div className="relative">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "400px" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchControl />
        <Marker
          draggable
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}
          icon={customIcon}
        />
      </MapContainer>
      <Button
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white  font-semibold text-[17px] tracking-[1px]
        px-6 py-5 rounded-md shadow-md z-[1000]"
        onClick={() => onConfirm(selectedAddress)}
      >
        <FormattedMessage id="confirm" />
      </Button>
    </div>
  );
};

export default Map;
