import { Activity, Brain, Dna, Droplets, Shield, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { MentalHealthPanel } from './MentalHealthPanel';
import { PharmacogenomicsPanel } from './PharmacogenomicsPanel';
import { GutBrainPanel } from './GutBrainPanel';
import { SISDomainPanel } from './SISDomainPanel';
import { ClinicalFlagsPanel } from './ClinicalFlagsPanel';
import {
  getPHQ9Scores,
  getGAD7Scores,
  getGutBiomeMetrics,
  getNeuroinflammationProfile,
  getPharmacogenomicsProfile,
  getFuglMeyerScores,
  getSISDomainScores,
  generateClinicalFlags,
} from '../utils/observationUtils';

interface MDTSummaryDashboardProps {
  observations: fhir.Observation[];
  onViewMentalHealth?: () => void;
  onViewPharmacogenomics?: () => void;
  onViewGutBrain?: () => void;
  onViewSIS?: () => void;
  onViewFlags?: () => void;
}

function SummaryCard({
  icon: Icon,
  title,
  value,
  subtitle,
  status,
  onClick,
  color,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle: string;
  status: 'success' | 'warning' | 'danger' | 'neutral';
  onClick?: () => void;
  color: string;
}) {
  const statusBg = status === 'success' ? 'bg-green-50 border-green-200' :
                   status === 'warning' ? 'bg-amber-50 border-amber-200' :
                   status === 'danger' ? 'bg-red-50 border-red-200' :
                   'bg-gray-50 border-gray-200';

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 border ${statusBg} cursor-pointer hover:shadow-md transition-all ${!onClick && 'cursor-default'}`}
    >
      <div className="flex items-start justify-between mb-2">
        <Icon className="w-5 h-5" style={{ color }} />
        <Badge variant={status} size="sm">
          {status === 'success' ? 'OK' : status === 'warning' ? 'Monitor' : status === 'danger' ? 'Alert' : 'N/A'}
        </Badge>
      </div>
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
  );
}

function QuickMetricRow({
  label,
  value,
  unit,
  status,
}: {
  label: string;
  value: number | string | null;
  unit?: string;
  status: 'success' | 'warning' | 'danger' | 'neutral';
}) {
  const colorClass = status === 'success' ? 'text-green-600' :
                      status === 'warning' ? 'text-amber-600' :
                      status === 'danger' ? 'text-red-600' :
                      'text-gray-600';

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-600">{label}</span>
      <span className={`text-xs font-semibold ${colorClass}`}>
        {value !== null ? value : '—'} {unit}
      </span>
    </div>
  );
}

export function MDTSummaryDashboard({
  observations,
  onViewMentalHealth,
  onViewPharmacogenomics,
  onViewGutBrain,
  onViewSIS,
  onViewFlags,
}: MDTSummaryDashboardProps) {
  const phq9Scores = getPHQ9Scores(observations);
  const gad7Scores = getGAD7Scores(observations);
  const gutBiome = getGutBiomeMetrics(observations);
  const neuroinflammation = getNeuroinflammationProfile(observations);
  const pgxProfiles = getPharmacogenomicsProfile(observations);
  const fmaScores = getFuglMeyerScores(observations);
  const sisScores = getSISDomainScores(observations);

  const flags = generateClinicalFlags(
    observations,
    phq9Scores[0] || null,
    gad7Scores[0] || null,
    gutBiome,
    neuroinflammation,
    pgxProfiles
  );

  const highSeverityCount = flags.filter(f => f.severity === 'high').length;
  const moderateSeverityCount = flags.filter(f => f.severity === 'moderate').length;

  // Calculate MDT risk summary
  const getRiskSummary = () => {
    const riskItems = [];
    if (phq9Scores[0] && phq9Scores[0].score >= 15) riskItems.push('Depression');
    if (gad7Scores[0] && gad7Scores[0].score >= 10) riskItems.push('Anxiety');
    if (pgxProfiles.some(p => p.phenotype.toLowerCase().includes('poor'))) riskItems.push('Medication');
    if (gutBiome && gutBiome.dysbiosisIndex > 3) riskItems.push('Gut Dysbiosis');
    if (neuroinflammation && neuroinflammation.crp && neuroinflammation.crp > 5) riskItems.push('Inflammation');
    return riskItems;
  };

  const riskSummary = getRiskSummary();
  const overallStatus: 'danger' | 'warning' | 'success' =
    highSeverityCount > 0 ? 'danger' :
    moderateSeverityCount > 0 || riskSummary.length > 0 ? 'warning' :
    'success';

  return (
    <div className="space-y-6">
      {/* Flags Banner */}
      {flags.length > 0 && (
        <ClinicalFlagsPanel observations={observations} />
      )}

      {/* MDT Quick Summary */}
      <Card>
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Multi-Disciplinary Team Overview</h3>
                <p className="text-xs text-gray-500">Holistic patient monitoring across behavioral, pharmacological, and physiological domains</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {overallStatus === 'success' ? (
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  All Clear
                </Badge>
              ) : overallStatus === 'warning' ? (
                <Badge variant="warning" className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Monitor
                </Badge>
              ) : (
                <Badge variant="danger" className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Action Required
                </Badge>
              )}
              {riskSummary.length > 0 && (
                <span className="text-xs text-gray-500">
                  Risk areas: {riskSummary.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Mental Health Quick View */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <h4 className="text-sm font-semibold text-gray-800">Behavioral Health</h4>
              </div>
              <QuickMetricRow
                label="PHQ-9"
                value={phq9Scores[0]?.score ?? '—'}
                status={
                  phq9Scores[0]
                    ? phq9Scores[0].score >= 15 ? 'danger' :
                      phq9Scores[0].score >= 10 ? 'warning' : 'success'
                    : 'neutral'
                }
              />
              <QuickMetricRow
                label="GAD-7"
                value={gad7Scores[0]?.score ?? '—'}
                status={
                  gad7Scores[0]
                    ? gad7Scores[0].score >= 15 ? 'danger' :
                      gad7Scores[0].score >= 10 ? 'warning' : 'success'
                    : 'neutral'
                }
              />
              {phq9Scores[0] && (
                <button
                  onClick={onViewMentalHealth}
                  className="mt-2 text-xs text-purple-600 hover:text-purple-800 underline"
                >
                  View details
                </button>
              )}
            </div>

            {/* Pharmacogenomics Quick View */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Dna className="w-5 h-5 text-green-600" />
                <h4 className="text-sm font-semibold text-gray-800">Pharmacogenomics</h4>
              </div>
              <QuickMetricRow
                label="Genes Tested"
                value={pgxProfiles.length}
                status={pgxProfiles.length > 0 ? 'success' : 'neutral'}
              />
              <QuickMetricRow
                label="Action Needed"
                value={pgxProfiles.filter(p => p.phenotype.toLowerCase().includes('poor') || p.phenotype.toLowerCase().includes('reduced')).length}
                status={pgxProfiles.some(p => p.phenotype.toLowerCase().includes('poor')) ? 'danger' : pgxProfiles.some(p => p.phenotype.toLowerCase().includes('reduced')) ? 'warning' : 'success'}
              />
              {pgxProfiles.length > 0 && (
                <button
                  onClick={onViewPharmacogenomics}
                  className="mt-2 text-xs text-green-600 hover:text-green-800 underline"
                >
                  View profiles
                </button>
              )}
            </div>

            {/* Gut-Brain Axis Quick View */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-semibold text-gray-800">Gut-Brain Axis</h4>
              </div>
              <QuickMetricRow
                label="Dysbiosis Index"
                value={gutBiome?.dysbiosisIndex.toFixed(1) ?? '—'}
                status={gutBiome
                  ? gutBiome.dysbiosisIndex > 3 ? 'danger' :
                    gutBiome.dysbiosisIndex > 2 ? 'warning' : 'success'
                  : 'neutral'
                }
              />
              <QuickMetricRow
                label="hs-CRP"
                value={neuroinflammation?.crp?.toFixed(1) ?? '—'}
                unit="mg/L"
                status={neuroinflammation?.crp
                  ? neuroinflammation.crp > 5 ? 'danger' :
                    neuroinflammation.crp > 3 ? 'warning' : 'success'
                  : 'neutral'
                }
              />
              {(gutBiome || neuroinflammation) && (
                <button
                  onClick={onViewGutBrain}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  View analysis
                </button>
              )}
            </div>

            {/* SIS Quick View */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-teal-600" />
                <h4 className="text-sm font-semibold text-gray-800">Stroke Impact</h4>
              </div>
              <QuickMetricRow
                label="SIS Recovery"
                value={sisScores[0]?.recovery.toFixed(0) ?? '—'}
                unit="%"
                status={sisScores[0] ? sisScores[0].recovery < 50 ? 'danger' : sisScores[0].recovery < 70 ? 'warning' : 'success' : 'neutral'}
              />
              <QuickMetricRow
                label="Fugl-Meyer"
                value={fmaScores[0]?.total ?? '—'}
                unit="/100"
                status={fmaScores[0] ? fmaScores[0].total < 40 ? 'danger' : fmaScores[0].total < 70 ? 'warning' : 'success' : 'neutral'}
              />
              {sisScores[0] && (
                <button
                  onClick={onViewSIS}
                  className="mt-2 text-xs text-teal-600 hover:text-teal-800 underline"
                >
                  View domains
                </button>
              )}
            </div>
          </div>

          {/* Action Items */}
          {flags.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-600" />
                Action Items ({flags.length})
              </h4>
              <div className="space-y-2">
                {flags.slice(0, 3).map(flag => (
                  <div key={flag.id} className="flex items-start gap-2 text-sm">
                    {flag.severity === 'high' ? (
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <span className="font-medium text-gray-800">{flag.title}</span>
                      {flag.severity === 'high' && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">Critical</span>
                      )}
                    </div>
                  </div>
                ))}
                {flags.length > 3 && (
                  <button
                    onClick={onViewFlags}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    +{flags.length - 3} more alert{flags.length - 3 > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Panels - shown when no specific tab selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MentalHealthPanel observations={observations} />
        <PharmacogenomicsPanel observations={observations} />
        <SISDomainPanel observations={observations} />
        <GutBrainPanel observations={observations} />
      </div>
    </div>
  );
}
