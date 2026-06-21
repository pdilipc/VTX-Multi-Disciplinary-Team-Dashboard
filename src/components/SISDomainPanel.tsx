import { Activity, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { getSISDomainScores, SISDomainScores } from '../utils/observationUtils';
import { useState } from 'react';

interface SISDomainPanelProps {
  observations: fhir.Observation[];
}

const SIS_DOMAINS: Array<{
  key: keyof SISDomainScores;
  label: string;
  color: string;
  description: string;
}> = [
  { key: 'strength', label: 'Strength', color: '#3b82f6', description: 'Muscle strength and motor control' },
  { key: 'handFunction', label: 'Hand Function', color: '#8b5cf6', description: 'Fine motor and dexterity' },
  { key: 'mobility', label: 'Mobility', color: '#14b8a6', description: 'Walking and transfers' },
  { key: 'emotion', label: 'Emotion', color: '#f59e0b', description: 'Mood and emotional regulation' },
  { key: 'communication', label: 'Communication', color: '#ec4899', description: 'Speech and language' },
  { key: 'adl', label: 'ADL/IADL', color: '#10b981', description: 'Activities of daily living' },
  { key: 'memory', label: 'Memory', color: '#6366f1', description: 'Cognitive function' },
  { key: 'participation', label: 'Participation', color: '#0ea5e9', description: 'Social engagement' },
];

function DomainBar({
  label,
  value,
  max = 100,
  color,
  description,
}: {
  label: string;
  value: number;
  max?: number;
  color: string;
  description: string;
}) {
  const pct = (value / max) * 100;
  const severity: 'danger' | 'warning' | 'success' = value < 40 ? 'danger' : value < 70 ? 'warning' : 'success';

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="text-sm font-medium text-gray-800">{label}</span>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color }}>{value.toFixed(0)}</span>
          <span className="text-xs text-gray-400">/ {max}</span>
          <Badge variant={severity} size="sm">
            {value < 40 ? 'Severe' : value < 70 ? 'Moderate' : 'Mild/None'}
          </Badge>
        </div>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function RadarChart({ scores }: { scores: SISDomainScores }) {
  const size = 200;
  const center = size / 2;
  const maxRadius = 80;

  const domains = SIS_DOMAINS.slice(0, 8); // Exclude recovery
  const angleStep = (2 * Math.PI) / domains.length;

  const points = domains.map((domain, i) => {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    const radius = (scores[domain.key] / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [25, 50, 75, 100];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid circles */}
      {gridLevels.map(level => (
        <circle
          key={level}
          cx={center}
          cy={center}
          r={(level / 100) * maxRadius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray={level === 50 ? "4,2" : "none"}
        />
      ))}

      {/* Domain lines */}
      {domains.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + maxRadius * Math.cos(angle);
        const y = center + maxRadius * Math.sin(angle);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        );
      })}

      {/* Score polygon */}
      <polygon
        points={points}
        fill="rgba(59, 130, 246, 0.2)"
        stroke="#3b82f6"
        strokeWidth="2"
      />

      {/* Score points */}
      {domains.map((domain, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const radius = (scores[domain.key] / 100) * maxRadius;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill={domain.color}
            stroke="white"
            strokeWidth="2"
          />
        );
      })}

      {/* Labels */}
      {domains.map((domain, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = maxRadius + 20;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="#6b7280"
          >
            {domain.label}
          </text>
        );
      })}
    </svg>
  );
}

export function SISDomainPanel({ observations }: SISDomainPanelProps) {
  const sisScores = getSISDomainScores(observations);
  const [expanded, setExpanded] = useState(false);

  const latestScores = sisScores[0];
  const previousScores = sisScores.length > 1 ? sisScores[1] : null;

  if (!latestScores) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Stroke Impact Scale (SIS)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No Stroke Impact Scale data available</p>
            <p className="text-xs text-gray-400 mt-1">
              SIS 3.0 domain scores will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate average domain score
  const domainKeys = SIS_DOMAINS.map(d => d.key);
  const avgDomainScore = domainKeys.reduce((sum, key) => sum + latestScores[key], 0) / domainKeys.length;

  const recoveryDiff = previousScores
    ? latestScores.recovery - previousScores.recovery
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Stroke Impact Scale (SIS 3.0)
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant={avgDomainScore < 40 ? 'danger' : avgDomainScore < 70 ? 'warning' : 'success'}>
              Avg: {avgDomainScore.toFixed(0)}%
            </Badge>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Recovery Score */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Global Recovery Percent</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {latestScores.recovery.toFixed(0)}%
              </p>
              {recoveryDiff !== null && (
                <div className={`flex items-center gap-1 text-xs mt-1 ${recoveryDiff > 0 ? 'text-green-600' : recoveryDiff < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  <TrendingUp className={`w-3 h-3 ${recoveryDiff < 0 ? 'rotate-180' : ''}`} />
                  {recoveryDiff > 0 ? '+' : ''}{recoveryDiff.toFixed(0)}% from last
                </div>
              )}
            </div>
            <div className="w-24 h-24">
              <svg viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${latestScores.recovery}, 100`}
                />
                <text x="18" y="21" textAnchor="middle" fontSize="8" fill="#1f2937" fontWeight="bold">
                  {latestScores.recovery.toFixed(0)}%
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Radar Chart vs Domain Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <RadarChart scores={latestScores} />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Domain Breakdown</h4>
            {SIS_DOMAINS.slice(0, expanded ? 8 : 4).map(domain => (
              <DomainBar
                key={domain.key}
                label={domain.label}
                value={latestScores[domain.key]}
                color={domain.color}
                description={domain.description}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
          Assessment date: {latestScores.date}
        </div>
      </CardContent>
    </Card>
  );
}
