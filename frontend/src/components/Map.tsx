import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import { RiskZone, FilterState } from "../types";
import { getRiskColor } from "../utils/riskCalculation";
import {
  Satellite,
  Zap,
  Eye,
  Activity,
  AlertTriangle,
  Rocket,
  Globe,
} from "lucide-react";
import Card3D from "./Card3D";
import FloatingElement from "./FloatingElement";
import "leaflet/dist/leaflet.css";

// Extend window to include L and heatLayer
declare global {
  interface Window {
    L: any;
  }
}

interface MapProps {
  riskZones: RiskZone[];
  filters: FilterState;
}

const MapUpdater: React.FC<{
  riskZones: RiskZone[];
  onMapReady: (map: any) => void;
}> = ({ riskZones, onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  useEffect(() => {
    if (riskZones.length > 0) {
      const bounds = new LatLngBounds(
        riskZones.map((zone) => [zone.lat, zone.lng])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, riskZones]);

  return null;
};

const Map: React.FC<MapProps> = ({ riskZones, filters }) => {
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);
  const [map, setMap] = useState<any>(null);
  const markersRef = useRef<any[]>([]);
  const heatLayerRef = useRef<any>(null);

  // Load Leaflet Heat plugin
  useEffect(() => {
    const loadHeatPlugin = async () => {
      if (typeof window !== "undefined" && !window.L?.heatLayer) {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js";
        script.async = true;
        document.head.appendChild(script);

        return new Promise((resolve) => {
          script.onload = resolve;
        });
      }
    };

    loadHeatPlugin();
  }, []);

  const updateMapMarkers = () => {
    if (!map || !window.L?.heatLayer) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Remove existing heat layer
    if (heatLayerRef.current) {
      heatLayerRef.current.remove();
    }

    const L = window.L;

    // Create heatmap data from risk zones
    const heatmapData = riskZones.map((zone) => [
      zone.lat,
      zone.lng,
      zone.riskScore / 100, // Normalize risk score to 0-1
    ]);

    // Add heat layer
    heatLayerRef.current = L.heatLayer(heatmapData, {
      radius: 60,
      blur: 40,
      maxZoom: 13,
      max: 1.0,
      gradient: {
        0.08: "#10b981", // green - low risk
        0.25: "#84cc16", // lime
        0.4: "#fbbf24", // amber
        0.6: "#f97316", // orange
        0.75: "#ef4444", // red - high risk
        1.0: "#991b1b", // dark red
      },
    }).addTo(map);

    // Add high-risk incident markers
    riskZones.forEach((zone) => {
      if (zone.riskLevel === "high") {
        const iconHtml = `
          <div style="background: linear-gradient(45deg, #dc2626, #ef4444); border-radius: 50%; padding: 8px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.6), 0 0 20px rgba(220, 38, 38, 0.4); border: 2px solid #fbbf24; animation: pulse 2s infinite;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="m12 17 .01 0"/>
            </svg>
          </div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          </style>`;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "cosmic-incident-marker",
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([zone.lat, zone.lng], {
          icon: customIcon,
        }).addTo(map);

        marker.bindTooltip(
          `🚨 ${zone.name}<br/>Danger Zone - Risk: ${Math.round(
            zone.riskScore
          )}/100`,
          {
            permanent: false,
            direction: "top",
            className: "cosmic-tooltip",
          }
        );

        marker.on("click", () => {
          setSelectedZone(zone);
        });

        markersRef.current.push(marker);
      }
    });

    // Add regular zone markers
    riskZones.forEach((zone) => {
      const color = getRiskColor(zone.riskLevel);
      const marker = L.circleMarker([zone.lat, zone.lng], {
        radius: 8,
        fillColor: "transparent",
        color: color,
        weight: 3,
        opacity: 0.8,
        fillOpacity: 0,
      }).addTo(map);

      marker.bindTooltip(
        `${
          zone.name
        }<br/>Risk Level: ${zone.riskLevel.toUpperCase()}<br/>Score: ${Math.round(
          zone.riskScore
        )}/100`,
        {
          permanent: false,
          direction: "top",
          className: "cosmic-tooltip",
        }
      );

      marker.on("click", () => {
        setSelectedZone(zone);
      });

      markersRef.current.push(marker);
    });
  };

  // Update markers when data changes
  useEffect(() => {
    if (map && riskZones.length > 0) {
      updateMapMarkers();
    }
  }, [map, riskZones]);

  const getRiskDescription = (zone: RiskZone): string => {
    const score = Math.round(zone.riskScore);
    switch (zone.riskLevel) {
      case "low":
        return `🌟 Optimal conditions for space exploration`;
      case "medium":
        return `⚠️ Nebula interference - Exercise caution during EVA`;
      case "high":
        return `🚨 Cosmic storm detected - Return to ship immediately`;
    }
  };

  const getRiskIcon = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low":
        return <Eye className="w-5 h-5 text-emerald-400" />;
      case "medium":
        return <Activity className="w-5 h-5 text-amber-400" />;
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
    }
  };

  const getRiskGradient = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low":
        return "from-emerald-600/30 to-green-600/30 border-emerald-400/50";
      case "medium":
        return "from-amber-600/30 to-orange-600/30 border-amber-400/50";
      case "high":
        return "from-red-600/30 to-pink-600/30 border-red-400/50";
    }
  };

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="h-full w-full rounded-3xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MapContainer
          center={[40.7589, -73.9851]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          className="rounded-3xl"
        >
          <TileLayer
            attribution="&copy; Cosmic Navigation Systems"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

          <MapUpdater riskZones={riskZones} onMapReady={setMap} />
        </MapContainer>
      </motion.div>
      {/* Enhanced Legend */}
      <FloatingElement delay={0.3} intensity={4}>
        <motion.div
          className="absolute top-6 right-6 z-[1000]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card3D
            className="p-10 w-96"
            glowColor="rgba(139, 92, 246, 0.7)"
            variant="galaxy"
          >
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Rocket className="w-6 h-6 text-purple-400" />
              </motion.div>
              <span className="text-purple-200 drop-shadow-lg">
                🌌 Threat Matrix
              </span>
            </h4>
            <div className="space-y-3">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(16, 185, 129, 0.5)",
                      "0 0 20px rgba(16, 185, 129, 0.8)",
                      "0 0 10px rgba(16, 185, 129, 0.5)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-emerald-200/90">
                  🌟 Safe Zone - Optimal for exploration
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(245, 158, 11, 0.5)",
                      "0 0 20px rgba(245, 158, 11, 0.8)",
                      "0 0 10px rgba(245, 158, 11, 0.5)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
                <span className="text-sm font-medium text-amber-200/90">
                  ⚠️ Nebula Alert - Exercise caution
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-red-400 shadow-lg shadow-red-400/50"
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(239, 68, 68, 0.5)",
                      "0 0 20px rgba(239, 68, 68, 0.8)",
                      "0 0 10px rgba(239, 68, 68, 0.5)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                />
                <span className="text-sm font-medium text-red-200/90">
                  🚨 Danger Zone - Return to ship
                </span>
              </motion.div>
            </div>
          </Card3D>
        </motion.div>
      </FloatingElement>
      {/* Selected Zone Details Modal */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedZone(null)}
          >
            <motion.div
              className="max-w-2xl w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card3D
                className="p-8"
                glowColor={
                  selectedZone.riskLevel === "high"
                    ? "rgba(239, 68, 68, 0.8)"
                    : selectedZone.riskLevel === "medium"
                    ? "rgba(245, 158, 11, 0.8)"
                    : "rgba(16, 185, 129, 0.8)"
                }
                variant={
                  selectedZone.riskLevel === "high"
                    ? "cosmic"
                    : selectedZone.riskLevel === "medium"
                    ? "nebula"
                    : "galaxy"
                }
              >
                <div
                  className={`bg-gradient-to-br ${getRiskGradient(
                    selectedZone.riskLevel
                  )} rounded-2xl p-6 backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    {getRiskIcon(selectedZone.riskLevel)}
                    <div>
                      <h3 className="font-bold text-cyan-200 text-2xl drop-shadow-lg">
                        🌌 {selectedZone.name}
                      </h3>
                      <p className="text-lg text-cyan-200/90 drop-shadow-lg">
                        Threat Level: {Math.round(selectedZone.riskScore)}/100
                      </p>
                    </div>
                  </div>

                  <p className="text-lg mb-6 font-medium text-cyan-200/90 drop-shadow-lg">
                    {getRiskDescription(selectedZone)}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Air Quality */}
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-200 mb-4 flex items-center gap-2 drop-shadow-lg">
                        <Satellite className="w-5 h-5 text-cyan-300" />
                        🌌 Atmospheric Analysis
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-cyan-500/20 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/40">
                          <span className="font-medium text-cyan-200/80">
                            PM₂.₅:
                          </span>
                          <span className="ml-2 font-bold text-cyan-200">
                            {selectedZone.data.pollutants.pm25} μg/m³
                          </span>
                        </div>
                        <div className="bg-cyan-500/20 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/40">
                          <span className="font-medium text-cyan-200/80">
                            NO₂:
                          </span>
                          <span className="ml-2 font-bold text-cyan-200">
                            {selectedZone.data.pollutants.no2} μg/m³
                          </span>
                        </div>
                        <div className="bg-cyan-500/20 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/40">
                          <span className="font-medium text-cyan-200/80">
                            O₃:
                          </span>
                          <span className="ml-2 font-bold text-cyan-200">
                            {selectedZone.data.pollutants.o3} μg/m³
                          </span>
                        </div>
                        <div className="bg-cyan-500/20 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/40">
                          <span className="font-medium text-cyan-200/80">
                            AQI:
                          </span>
                          <span className="ml-2 font-bold text-cyan-200">
                            {selectedZone.data.aqi}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Weather */}
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-200 mb-4 flex items-center gap-2 drop-shadow-lg">
                        <Globe className="w-5 h-5 text-purple-300" />
                        🌡️ Environmental Matrix
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40">
                          <span className="font-medium text-purple-200/80">
                            Temp:
                          </span>
                          <span className="ml-2 font-bold text-purple-200">
                            {selectedZone.data.weather.temperature}°C
                          </span>
                        </div>
                        <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40">
                          <span className="font-medium text-purple-200/80">
                            Humidity:
                          </span>
                          <span className="ml-2 font-bold text-purple-200">
                            {selectedZone.data.weather.humidity}%
                          </span>
                        </div>
                        <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40">
                          <span className="font-medium text-purple-200/80">
                            Solar Wind:
                          </span>
                          <span className="ml-2 font-bold text-purple-200">
                            {selectedZone.data.weather.windSpeed} km/h
                          </span>
                        </div>
                        <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40">
                          <span className="font-medium text-purple-200/80">
                            Cosmic Dust:
                          </span>
                          <span className="ml-2 font-bold text-purple-200">
                            {selectedZone.data.pollen}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <motion.button
                      onClick={() => setSelectedZone(null)}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close Transmission
                    </motion.button>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Custom CSS for tooltips */}
      <style jsx global>{`
        .cosmic-tooltip {
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 0.95),
            rgba(30, 41, 59, 0.95)
          ) !important;
          border: 1px solid rgba(6, 182, 212, 0.5) !important;
          border-radius: 12px !important;
          color: #e2e8f0 !important;
          font-weight: 500 !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(6, 182, 212, 0.2) !important;
          backdrop-filter: blur(10px) !important;
        }

        .cosmic-incident-marker {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }
      `}</style>
    </div>
  );
};

export default Map;
