import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import FilterSidebar from '../components/FilterSidebar';
import ThreeBackground from '../components/ThreeBackground';
import NeuralNetwork from '../components/NeuralNetwork';
import Card3D from '../components/Card3D';
import { FilterState, RiskZone } from '../types';
import { environmentalData } from '../data/mockData';
import { processEnvironmentalData } from '../utils/riskCalculation';
import { apiGet } from '../services/api';
import ReconnectingWebSocket from '../services/ws';

const MapPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({ ageGroup: 'young-adults', asthmaSeverity: 'mild-persistent' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [riskZones, setRiskZones] = useState<RiskZone[]>(() => processEnvironmentalData(environmentalData, filters));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const qs = `?ageGroup=${filters.ageGroup}&severity=${filters.asthmaSeverity}`;
        const res = await apiGet<RiskZone[]>(`/api/v1/risk-zones${qs}`);
        if (res && res.length) {
          setRiskZones(res);
        } else {
          // fallback to local processing
          setRiskZones(processEnvironmentalData(environmentalData, filters));
        }
      } catch (err) {
        // API might not be available yet -> fallback to mock data
        setRiskZones(processEnvironmentalData(environmentalData, filters));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters]);

  // WebSocket subscription for realtime updates
  useEffect(() => {
    const ws = new ReconnectingWebSocket('/ws/updates');
    ws.onMessage((msg) => {
      try {
        if (msg?.type === 'new_point' && msg.payload) {
          const incoming = msg.payload as any;
          setRiskZones(prev => {
            // dedupe by id
            if (prev.find(r => r.id === incoming.id)) return prev.map(r => r.id === incoming.id ? incoming : r);
            return [...prev, incoming];
          });
        }
      } catch (e) {
        // ignore
      }
    });

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <ThreeBackground />
      <NeuralNetwork />

      <div className="flex-shrink-0">
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="relative z-10 px-4 lg:px-6 py-4">
          <Card3D className="p-4" glowColor="rgba(139, 92, 246, 0.6)">
            <div className="flex items-center justify-between">
              <div className="flex-1 lg:pl-0 pl-16">
                <h1 className="text-2xl lg:text-3xl font-bold">Cosmic Health Navigator</h1>
                <p className="text-cyan-200/90 mt-1 font-medium">Interactive safety map</p>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <div className="px-4 py-2 rounded-2xl bg-emerald-600/10">Status: {loading ? 'Loading' : 'Live'}</div>
              </div>
            </div>
          </Card3D>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <div className="h-full min-h-[400px] lg:min-h-[500px] relative">
            <Map riskZones={riskZones} />
          </div>
        </main>

        <footer className="relative z-10 px-4 lg:px-6 py-3">
          <Card3D className="p-3" glowColor="rgba(6, 182, 212, 0.6)" variant="cosmic">
            <div className="flex items-center justify-between">
              <div>Updated: {new Date().toLocaleTimeString()}</div>
              <div>Orbital sync every 30min</div>
            </div>
          </Card3D>
        </footer>
      </div>
    </div>
  );
};

export default MapPage;
