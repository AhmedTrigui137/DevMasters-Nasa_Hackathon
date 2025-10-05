import { EnvironmentalData, FilterState, RiskZone } from '../types';
import { ageGroups, asthmaSeverities } from '../data/mockData';

export const calculateRiskScore = (
  data: EnvironmentalData,
  filters: FilterState
): number => {
  const ageGroup = ageGroups.find(ag => ag.id === filters.ageGroup);
  const severity = asthmaSeverities.find(as => as.id === filters.asthmaSeverity);
  
  if (!ageGroup || !severity) return 0;

  let score = 0;
  let totalFactors = 0;

  // Age-specific sensitivities
  const ageSensitivities = ageGroup.sensitivities;
  const severityTriggers = severity.triggers;
  
  // Combine both age and severity factors
  const relevantFactors = [...new Set([...ageSensitivities, ...severityTriggers])];

  relevantFactors.forEach(factor => {
    totalFactors++;
    let value = 0;
    let threshold = 0;

    switch (factor) {
      case 'pm25':
        value = data.pollutants.pm25;
        threshold = severity.level === 1 ? 35 : severity.level === 2 ? 25 : severity.level === 3 ? 15 : 10;
        break;
      case 'pm10':
        value = data.pollutants.pm10;
        threshold = severity.level === 1 ? 50 : severity.level === 2 ? 40 : severity.level === 3 ? 30 : 20;
        break;
      case 'no2':
        value = data.pollutants.no2;
        threshold = severity.level === 1 ? 100 : severity.level === 2 ? 80 : severity.level === 3 ? 60 : 40;
        break;
      case 'o3':
        value = data.pollutants.o3;
        threshold = severity.level === 1 ? 120 : severity.level === 2 ? 100 : severity.level === 3 ? 80 : 60;
        break;
      case 'hcho':
        value = data.pollutants.hcho;
        threshold = severity.level === 1 ? 30 : severity.level === 2 ? 25 : severity.level === 3 ? 20 : 15;
        break;
      case 'temperature':
        // Extreme temperatures (< 5°C or > 30°C are risky)
        value = Math.abs(data.weather.temperature - 20);
        threshold = severity.level === 1 ? 15 : severity.level === 2 ? 12 : severity.level === 3 ? 8 : 5;
        break;
      case 'humidity':
        // Very low (< 30%) or high (> 70%) humidity
        value = data.weather.humidity > 70 ? data.weather.humidity - 70 : 
                data.weather.humidity < 30 ? 30 - data.weather.humidity : 0;
        threshold = severity.level === 1 ? 25 : severity.level === 2 ? 20 : severity.level === 3 ? 15 : 10;
        break;
      case 'pollen':
        value = data.pollen;
        threshold = severity.level === 1 ? 80 : severity.level === 2 ? 60 : severity.level === 3 ? 40 : 20;
        break;
      case 'pressure':
        // Low pressure can trigger symptoms
        value = Math.max(0, 1015 - data.weather.pressure);
        threshold = severity.level === 1 ? 15 : severity.level === 2 ? 12 : severity.level === 3 ? 8 : 5;
        break;
      case 'wind':
        // Very low or high wind speeds
        value = data.weather.windSpeed < 3 ? 3 - data.weather.windSpeed : 
                data.weather.windSpeed > 20 ? data.weather.windSpeed - 20 : 0;
        threshold = severity.level === 1 ? 10 : severity.level === 2 ? 8 : severity.level === 3 ? 6 : 4;
        break;
    }

    // Calculate risk contribution (0-100 scale)
    const riskContribution = Math.min(100, (value / threshold) * 100);
    score += riskContribution;
  });

  return totalFactors > 0 ? score / totalFactors : 0;
};

export const calculateRiskLevel = (score: number): 'low' | 'medium' | 'high' => {
  if (score < 30) return 'low';
  if (score < 65) return 'medium';
  return 'high';
};

export const getRiskColor = (level: 'low' | 'medium' | 'high'): string => {
  switch (level) {
    case 'low': return '#10b981'; // green-500
    case 'medium': return '#f59e0b'; // amber-500
    case 'high': return '#ef4444'; // red-500
  }
};

export const processEnvironmentalData = (
  data: EnvironmentalData[],
  filters: FilterState
): RiskZone[] => {
  return data.map(location => {
    const riskScore = calculateRiskScore(location, filters);
    const riskLevel = calculateRiskLevel(riskScore);
    
    return {
      id: location.id,
      lat: location.lat,
      lng: location.lng,
      name: location.name,
      riskLevel,
      riskScore,
      data: location
    };
  });
};