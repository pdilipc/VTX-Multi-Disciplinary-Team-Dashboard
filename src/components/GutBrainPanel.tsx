import { Activity, Brain, AlertTriangle, Shield, Droplets } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { getGutBiomeMetrics, getNeuroinflammationProfile, GutBiomeMetrics, NeuroinflammationProfile } from '../utils/observationUtils';

interface GutBrainPanelProps {
  observations: fhir.Observation[];
}

function GutMetricRow({
  label,
  value,
  unit,
  normalRange,
  isElevated,
  isLow,
}: {
  label: string;
  value: number;
  unit: string;
  normalRange: string;
  isElevated: boolean;
  isLow: boolean;
}) {
  const status: 'danger' | 'warning' | 'success' = isElevated ? 'danger' : isLow ? 'warning' : 'success';

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">Normal: {normalRange}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-bold ${isElevated ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-gray-900'}`}>
          {value.toFixed(value < 1 ? 3 : value < 10 ? 1 : 0)}
        </span>
        <span className="text-xs text-gray-500">{unit}</span>
        <Badge variant={status} size="sm">{isElevated ? 'High' : isLow ? 'Low' : 'OK'}</Badge>
      </div>
    </div>
  );
}

function InflammationBar({
  label,
  value,
  max,
  normalCutoff,
  unit,
}: {
  label: string;
  value: number | undefined;
  max: number;
  normalCutoff: number;
  unit: string;
}) {
  if (value === undefined) return null;

  const pct = Math.min((value / max) * 100, 100);
  const isElevated = value > normalCutoff;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className={`text-xs font-bold ${isElevated ? 'text-red-600' : 'text-gray-900'}`}>
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all ${isElevated ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-green-400 to-teal-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-xs text-gray-400">0</span>
        <span className="text-xs text-gray-400">{normalCutoff} (cutoff)</span>
        <span className="text-xs text-gray-400">{max}</span>
      </div>
    </div>
  );
}

export function GutBrainPanel({ observations }: GutBrainPanelProps) {
  const gutBiomeMetrics = getGutBiomeMetrics(observations);
  const neuroinflammation = getNeuroinflammationProfile(observations);

  const hasData = gutBiomeMetrics !== null || neuroinflammation !== null;

  // Calculate composite risk
  const gutRisk = gutBiomeMetrics
    ? (gutBiomeMetrics.dysbiosisIndex > 3 ? 2 : gutBiomeMetrics.dysbiosisIndex > 2 ? 1 : 0) +
      (gutBiomeMetrics.zonulin > 2.5 ? 2 : gutBiomeMetrics.zonulin > 1.5 ? 1 : 0)
    : 0;

  const inflamRisk = neuroinflammation
    ? (neuroinflammation.crp && neuroinflammation.crp > 5 ? 2 : neuroinflammation.crp && neuroinflammation.crp > 3 ? 1 : 0) +
      (neuroinflammation.il6 && neuroinflammation.il6 > 5 ? 2 : 0) +
      (neuroinflammation.nfl && neuroinflammation.nfl > 20 ? 2 : 0)
    : 0;

  const combinedRisk = gutRisk + inflamRisk;
  const riskLevel: 'high' | 'moderate' | 'low' =
    combinedRisk >= 4 ? 'high' : combinedRisk >= 2 ? 'moderate' : 'low';

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Gut-Brain Axis & Neuroinflammation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No gut biome or inflammation markers recorded</p>
            <p className="text-xs text-gray-400 mt-1">
              Dysbiosis index, SCFAs, and inflammation markers will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Gut-Brain Axis & Neuroinflammation
          </CardTitle>
          <div className="flex items-center gap-2">
            {riskLevel === 'high' && <Badge variant="danger">High Risk</Badge>}
            {riskLevel === 'moderate' && <Badge variant="warning">Moderate Risk</Badge>}
            {riskLevel === 'low' && <Badge variant="success">Low Risk</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Gut Biome Metrics */}
        {gutBiomeMetrics && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              Gut Microbiome
            </h4>
            <div className="bg-blue-50 rounded-xl p-4">
              <GutMetricRow
                label="Dysbiosis Index"
                value={gutBiomeMetrics.dysbiosisIndex}
                unit=""
                normalRange="&lt;2"
                isElevated={gutBiomeMetrics.dysbiosisIndex > 3}
                isLow={gutBiomeMetrics.dysbiosisIndex < 1}
              />
              <GutMetricRow
                label="Short-Chain Fatty Acids"
                value={gutBiomeMetrics.scfaTotal}
                unit="mmol/L"
                normalRange="&gt;50"
                isElevated={false}
                isLow={gutBiomeMetrics.scfaTotal < 50}
              />
              <GutMetricRow
                label="Butyrate"
                value={gutBiomeMetrics.butyrate}
                unit="mmol/L"
                normalRange="&gt;5"
                isElevated={false}
                isLow={gutBiomeMetrics.butyrate < 5}
              />
              <GutMetricRow
                label="Zonulin (Permeability)"
                value={gutBiomeMetrics.zonulin}
                unit="ng/mL"
                normalRange="&lt;2.5"
                isElevated={gutBiomeMetrics.zonulin > 2.5}
                isLow={false}
              />
              <GutMetricRow
                label="Fecal Calprotectin"
                value={gutBiomeMetrics.calprotectin}
                unit="ug/g"
                normalRange="&lt;50"
                isElevated={gutBiomeMetrics.calprotectin > 50}
                isLow={false}
              />
            </div>
          </div>
        )}

        {/* Neuroinflammation Markers */}
        {neuroinflammation && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-red-600" />
              Neuroinflammation Markers
            </h4>
            <div className="bg-red-50 rounded-xl p-4">
              <InflammationBar
                label="hs-CRP (Cardiovascular)"
                value={neuroinflammation.crp}
                max={20}
                normalCutoff={3}
                unit="mg/L"
              />
              <InflammationBar
                label="Interleukin-6"
                value={neuroinflammation.il6}
                max={20}
                normalCutoff={5}
                unit="pg/mL"
              />
              <InflammationBar
                label="TNF-alpha"
                value={neuroinflammation.tnfAlpha}
                max={30}
                normalCutoff={10}
                unit="pg/mL"
              />
              <InflammationBar
                label="Neurofilament Light (NfL)"
                value={neuroinflammation.nfl}
                max={50}
                normalCutoff={20}
                unit="pg/mL"
              />
              <InflammationBar
                label="GFAP (Glial marker)"
                value={neuroinflammation.gfap}
                max={300}
                normalCutoff={150}
                unit="pg/mL"
              />
            </div>
          </div>
        )}

        {/* Clinical Interpretation */}
        {combinedRisk >= 4 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Gut-Brain Axis Alert</p>
                <p className="text-xs text-amber-700 mt-1">
                  Elevated dysbiosis and inflammatory markers suggest compromised gut-brain axis.
                  Consider microbiome intervention, anti-inflammatory nutrition, and probiotic therapy.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
          Last updated: {gutBiomeMetrics?.date || neuroinflammation?.date || 'N/A'}
        </div>
      </CardContent>
    </Card>
  );
}
