import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Rocket, Globe, Clock, Shield, Zap } from 'lucide-react';
import Map from './components/Map';
import FilterSidebar from './components/FilterSidebar';
import ThreeBackground from './components/ThreeBackground';
import NeuralNetwork from './components/NeuralNetwork';
import Card3D from './components/Card3D';
import FloatingElement from './components/FloatingElement';
import { FilterState, RiskZone } from './types';
import { environmentalData } from './data/mockData';
import { processEnvironmentalData } from './utils/riskCalculation';

function App() {
  const [filters, setFilters] = useState<FilterState>({
    ageGroup: 'young-adults',
    asthmaSeverity: 'mild-persistent'
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Calculate risk zones based on current filters
  const riskZones = useMemo(() => {
    return processEnvironmentalData(environmentalData, filters);
  }, [filters]);

  // Get summary statistics
  const riskSummary = useMemo(() => {
    const total = riskZones.length;
    const lowRisk = riskZones.filter(zone => zone.riskLevel === 'low').length;
    const mediumRisk = riskZones.filter(zone => zone.riskLevel === 'medium').length;
    const highRisk = riskZones.filter(zone => zone.riskLevel === 'high').length;
    
    return { total, lowRisk, mediumRisk, highRisk };
  }, [riskZones]);

  // Close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <ThreeBackground />
      <NeuralNetwork />
      
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Header */}
        <motion.header
          className="relative z-10 px-4 lg:px-6 py-4"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          <Card3D className="p-4" glowColor="rgba(139, 92, 246, 0.6)">
            <div className="flex items-center justify-between">
              <div className="flex-1 lg:pl-0 pl-16">
                <div className="flex items-center gap-4 mb-2">
                  <FloatingElement delay={0.1} intensity={3}>
                    <motion.div 
                      className="p-3 bg-gradient-to-br from-indigo-600 via-purple-700 to-cyan-600 rounded-2xl shadow-2xl border border-cyan-400/30"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        boxShadow: '0 0 50px rgba(6, 182, 212, 0.8)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Satellite className="w-7 h-7 text-cyan-200 drop-shadow-lg" />
                    </motion.div>
                  </FloatingElement>
                  <div>
                    <motion.h1 
                      className="text-2xl lg:text-3xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      style={{
                        background: 'linear-gradient(45deg, #ffffff, #06b6d4, #8b5cf6, #f59e0b, #ffffff)',
                        backgroundSize: '300% 100%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                      }}
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      Cosmic Health Navigator
                    </motion.h1>
                    <motion.p 
                      className="text-cyan-200/90 mt-1 font-medium drop-shadow-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      🚀 Interstellar environmental monitoring for cosmic health protection
                    </motion.p>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Quick Stats */}
              <div className="hidden sm:flex items-center gap-4">
                <motion.div
                  className="flex items-center gap-6"
                >
                  <FloatingElement delay={0.6} intensity={2}>
                    <motion.div 
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600/30 to-green-500/30 rounded-2xl border border-emerald-400/60 backdrop-blur-xl"
                      whileHover={{ scale: 1.05, y: -2 }}
                      animate={{ boxShadow: ['0 0 15px rgba(16, 185, 129, 0.4)', '0 0 30px rgba(16, 185, 129, 0.8)', '0 0 15px rgba(16, 185, 129, 0.4)'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/70"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-sm font-semibold text-emerald-200 drop-shadow-lg">Safe Zones: {riskSummary.lowRisk}</span>
                    </motion.div>
                  </FloatingElement>
                  <FloatingElement delay={0.8} intensity={2}>
                    <motion.div 
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600/30 to-orange-500/30 rounded-2xl border border-amber-400/60 backdrop-blur-xl"
                      whileHover={{ scale: 1.05, y: -2 }}
                      animate={{ boxShadow: ['0 0 15px rgba(245, 158, 11, 0.4)', '0 0 30px rgba(245, 158, 11, 0.8)', '0 0 15px rgba(245, 158, 11, 0.4)'] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/70"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                      <span className="text-sm font-semibold text-amber-200 drop-shadow-lg">Nebula Alert: {riskSummary.mediumRisk}</span>
                    </motion.div>
                  </FloatingElement>
                  <FloatingElement delay={1.0} intensity={2}>
                    <motion.div 
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600/30 to-pink-500/30 rounded-2xl border border-red-400/60 backdrop-blur-xl"
                      whileHover={{ scale: 1.05, y: -2 }}
                      animate={{ boxShadow: ['0 0 15px rgba(239, 68, 68, 0.4)', '0 0 30px rgba(239, 68, 68, 0.8)', '0 0 15px rgba(239, 68, 68, 0.4)'] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-red-400 shadow-lg shadow-red-400/70"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                      <span className="text-sm font-semibold text-red-200 drop-shadow-lg">Danger Zone: {riskSummary.highRisk}</span>
                    </motion.div>
                  </FloatingElement>
                </motion.div>
              </div>
            </div>
          </Card3D>
        </motion.header>

        {/* Map Container */}
        <main className="flex-1 p-4 lg:p-6">
          <motion.div
            className="h-full min-h-[400px] lg:min-h-[500px] relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Map riskZones={riskZones} filters={filters} />
          </motion.div>
        </main>

        {/* Enhanced Footer */}
        <motion.footer
          className="relative z-10 px-4 lg:px-6 py-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card3D className="p-3" glowColor="rgba(6, 182, 212, 0.6)" variant="cosmic">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center justify-center gap-8 text-sm">
                <FloatingElement delay={0.9} intensity={1}>
                  <motion.div 
                    className="flex items-center gap-2 text-cyan-200/90"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Rocket className="w-5 h-5 text-cyan-400" />
                    </motion.div>
                    <span className="font-medium drop-shadow-lg">Atmospheric Scanning</span>
                  </motion.div>
                </FloatingElement>
                <FloatingElement delay={1.1} intensity={1}>
                  <motion.div 
                    className="flex items-center gap-2 text-cyan-200/90"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <motion.div
                      animate={{ x: [-2, 2, -2] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Globe className="w-5 h-5 text-emerald-400" />
                    </motion.div>
                    <span className="font-medium drop-shadow-lg">Planetary Analysis</span>
                  </motion.div>
                </FloatingElement>
                <FloatingElement delay={1.3} intensity={1}>
                  <motion.div 
                    className="flex items-center gap-2 text-cyan-200/90"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="w-5 h-5 text-purple-400" />
                    </motion.div>
                    <span className="font-medium drop-shadow-lg">Cosmic Energy Detection</span>
                  </motion.div>
                </FloatingElement>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-cyan-200/70">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-4 h-4 text-cyan-300" />
                  </motion.div>
                  <span className="drop-shadow-lg">Updated: {new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Shield className="w-4 h-4 text-cyan-300" />
                  </motion.div>
                  <span className="drop-shadow-lg">Orbital sync every 30min</span>
                </div>
              </div>
            </div>
          </Card3D>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;