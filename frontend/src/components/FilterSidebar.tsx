import React, { useState } from "react";
import {
  ChevronDown,
  Filter,
  Rocket,
  Zap,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { FilterState } from "../types";
import { ageGroups, asthmaSeverities } from "../data/mockData";
import Card3D from "./Card3D";

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
}) => {
  const [ageGroupOpen, setAgeGroupOpen] = useState(true);
  const [severityOpen, setSeverityOpen] = useState(true);

  const handleAgeGroupChange = (ageGroupId: string) => {
    onFiltersChange({ ...filters, ageGroup: ageGroupId });
  };

  const handleSeverityChange = (severityId: string) => {
    onFiltersChange({ ...filters, asthmaSeverity: severityId });
  };

  const selectedAgeGroup = ageGroups.find((ag) => ag.id === filters.ageGroup);
  const selectedSeverity = asthmaSeverities.find(
    (as) => as.id === filters.asthmaSeverity
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-[1001] lg:hidden"
      >
        <Card3D
          className="p-3"
          glowColor="rgba(6, 182, 212, 0.8)"
          variant="cosmic"
        >
          <Filter className="w-5 h-5 text-cyan-200 drop-shadow-lg" />
        </Card3D>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 h-full w-80 lg:w-96 z-[1000] lg:z-auto transition-transform duration-300
          ${
            isOpen || window.innerWidth >= 1024
              ? "translate-x-0 opacity-100"
              : "-translate-x-80 opacity-0"
          }`}
      >
        <div className="h-full p-4 lg:p-6 overflow-y-auto">
          <Card3D
            className="h-full"
            intensity={0.8}
            glowColor="rgba(139, 92, 246, 0.7)"
            variant="galaxy"
          >
            <div className="p-4 lg:p-6 h-full">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 rounded-2xl shadow-2xl border border-purple-400/40">
                    <Star className="w-6 h-6 text-purple-200 drop-shadow-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white drop-shadow-lg">
                      Cosmic Health Hub
                    </h2>
                    <p className="text-sm text-purple-300/90 drop-shadow-lg">
                      🌌 Interstellar Health Monitoring
                    </p>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              </div>

              {/* Current Selection Summary */}
              {selectedAgeGroup && selectedSeverity && (
                <div className="mb-6">
                  <Card3D
                    className="p-4"
                    glowColor="rgba(6, 182, 212, 0.6)"
                    variant="cosmic"
                  >
                    <div className="bg-gradient-to-br from-cyan-600/20 via-indigo-600/20 to-purple-600/20 rounded-2xl p-4 backdrop-blur-sm border border-cyan-400/30">
                      <h3 className="text-base font-semibold text-cyan-200 drop-shadow-lg mb-2">
                        🚀 Astronaut Profile
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-cyan-200/90">
                            {selectedAgeGroup.name}
                          </span>
                          <span className="text-xs text-cyan-300">
                            ({selectedAgeGroup.range})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-purple-200/90">
                            {selectedSeverity.name}
                          </span>
                          <span className="text-xs text-purple-300">
                            Level {selectedSeverity.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </div>
              )}

              {/* Age Group Filter */}
              <div className="mb-6">
                <button
                  onClick={() => setAgeGroupOpen(!ageGroupOpen)}
                  className="flex items-center justify-between w-full"
                >
                  <Card3D
                    className="w-full p-4"
                    glowColor="rgba(16, 185, 129, 0.7)"
                    variant="nebula"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-xl shadow-lg border border-emerald-400/40">
                          <Users className="w-5 h-5 text-emerald-200 drop-shadow-lg" />
                        </div>
                        <span className="font-semibold text-emerald-200 drop-shadow-lg">
                          🌟 Crew Category
                        </span>
                      </div>
                      <ChevronDown className="w-5 h-5 text-emerald-200/80" />
                    </div>
                  </Card3D>
                </button>

                {ageGroupOpen && (
                  <div className="mt-4 space-y-3">
                    {ageGroups.map((ageGroup) => (
                      <label key={ageGroup.id} className="block cursor-pointer">
                        <Card3D
                          className="transition-all duration-300"
                          glowColor={
                            filters.ageGroup === ageGroup.id
                              ? "rgba(16, 185, 129, 0.6)"
                              : "rgba(255, 255, 255, 0.2)"
                          }
                        >
                          <div
                            className={`p-4 rounded-2xl ${
                              filters.ageGroup === ageGroup.id
                                ? "bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20"
                                : "bg-white/5"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="ageGroup"
                                value={ageGroup.id}
                                checked={filters.ageGroup === ageGroup.id}
                                onChange={() =>
                                  handleAgeGroupChange(ageGroup.id)
                                }
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-white mb-1">
                                  {ageGroup.name}
                                </div>
                                <div className="text-sm text-emerald-300 mb-2">
                                  {ageGroup.range}
                                </div>
                                <div className="text-xs text-white/80">
                                  {ageGroup.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card3D>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Asthma Severity Filter */}
              <div className="mb-6">
                <button
                  onClick={() => setSeverityOpen(!severityOpen)}
                  className="flex items-center justify-between w-full"
                >
                  <Card3D
                    className="w-full p-4"
                    glowColor="rgba(239, 68, 68, 0.7)"
                    variant="cosmic"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-orange-500 via-red-600 to-pink-600 rounded-xl shadow-lg border border-red-400/40">
                          <Zap className="w-5 h-5 text-red-200 drop-shadow-lg" />
                        </div>
                        <span className="font-semibold text-red-200 drop-shadow-lg">
                          ⚡ Threat Level
                        </span>
                      </div>
                      <ChevronDown className="w-5 h-5 text-red-200/80" />
                    </div>
                  </Card3D>
                </button>

                {severityOpen && (
                  <div className="mt-4 space-y-3">
                    {asthmaSeverities.map((severity) => (
                      <label key={severity.id} className="block cursor-pointer">
                        <Card3D
                          className="transition-all duration-300"
                          glowColor={
                            filters.asthmaSeverity === severity.id
                              ? "rgba(239, 68, 68, 0.6)"
                              : "rgba(255, 255, 255, 0.2)"
                          }
                        >
                          <div
                            className={`p-4 rounded-2xl ${
                              filters.asthmaSeverity === severity.id
                                ? "bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20"
                                : "bg-white/5"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="severity"
                                value={severity.id}
                                checked={filters.asthmaSeverity === severity.id}
                                onChange={() =>
                                  handleSeverityChange(severity.id)
                                }
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-white mb-1">
                                  {severity.name}{" "}
                                  <span className="ml-2 text-xs px-2 py-1 bg-red-400 text-white rounded-full">
                                    Level {severity.level}
                                  </span>
                                </div>
                                <div className="text-xs text-white/80">
                                  {severity.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card3D>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Information */}
              <Card3D
                className="p-4"
                glowColor="rgba(139, 92, 246, 0.6)"
                variant="galaxy"
              >
                <div className="bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl p-4 backdrop-blur-sm border border-purple-400/30">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-200 drop-shadow-lg">
                      🌌 Mission Control
                    </span>
                  </h4>
                  <div className="space-y-2 text-xs leading-relaxed">
                    <p className="text-purple-200/90">
                      Our quantum AI system monitors cosmic environmental data
                      across multiple dimensions including atmospheric
                      composition, stellar radiation, and nebula density.
                    </p>
                    <p className="text-purple-200/90">
                      Threat assessments are calibrated for each crew member's
                      biological profile and sensitivity matrix, ensuring safe
                      interstellar exploration.
                    </p>
                  </div>
                </div>
              </Card3D>
            </div>
          </Card3D>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-md z-[999]"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default FilterSidebar;
