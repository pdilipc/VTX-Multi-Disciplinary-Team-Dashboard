import { AlertTriangle, AlertCircle, CheckCircle, Shield, Pill, Brain, Activity, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { generateClinicalFlags, ClinicalFlag, getPHQ9Scores, getGAD7Scores, getGutBiomeMetrics, getNeuroinflammationProfile, getPharmacogenomicsProfile } from '../utils/observationUtils';

interface ClinicalFlagsPanelProps {
  observations: fhir.Observation[];
}

function FlagCard({ flag }: { flag: ClinicalFlag }) {
  const getCategoryIcon = () => {
    switch (flag.category) {
      case 'clinical':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'medication':
        return <Pill className="w-5 h-5 text-green-600" />;
      case 'behavioral':
        return <Brain className="w-5 h-5 text-purple-600" />;
      case 'safety':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryBg = () => {
    switch (flag.category) {
      case 'clinical':
        return 'bg-blue-50 border-blue-200';
      case 'medication':
        return 'bg-green-50 border-green-200';
      case 'behavioral':
        return 'bg-purple-50 border-purple-200';
      case 'safety':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const severityColor = flag.severity === 'high' ? 'text-red-600' :
                         flag.severity === 'moderate' ? 'text-amber-600' :
                         'text-blue-600';

  return (
    <div className={`rounded-xl p-4 border ${getCategoryBg()} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 ${severityColor}`}>
            {getCategoryIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{flag.title}</h4>
              <Badge variant={flag.severity === 'high' ? 'danger' : flag.severity === 'moderate' ? 'warning' : 'info'} size="sm">
                {flag.severity}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{flag.description}</p>
            {flag.recommendation && (
              <div className="mt-2 bg-white/50 rounded-lg p-2">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Recommendation:</span> {flag.recommendation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClinicalFlagsPanel({ observations }: ClinicalFlagsPanelProps) {
  const phq9Scores = getPHQ9Scores(observations);
  const gad7Scores = getGAD7Scores(observations);
  const gutBiome = getGutBiomeMetrics(observations);
  const neuroinflammation = getNeuroinflammationProfile(observations);
  const pgxProfiles = getPharmacogenomicsProfile(observations);

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

  if (flags.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-600" />
            Automated Clinical Flags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No active clinical flags</p>
            <p className="text-xs text-gray-400 mt-1">
              Automated alerts will appear here when risk thresholds are crossed
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${highSeverityCount > 0 ? 'border-red-200 bg-red-50/30' : moderateSeverityCount > 0 ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${highSeverityCount > 0 ? 'text-red-600' : moderateSeverityCount > 0 ? 'text-amber-600' : 'text-gray-600'}`} />
            Clinical Flags
            {highSeverityCount > 0 && (
              <Badge variant="danger">{highSeverityCount} Critical</Badge>
            )}
          </CardTitle>
          <span className="text-xs text-gray-500">MDT Automated Alerts</span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {highSeverityCount > 0 && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-semibold text-red-800">
                {highSeverityCount} high-priority alert{highSeverityCount > 1 ? 's' : ''} require immediate attention
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {flags.map(flag => (
            <FlagCard key={flag.id} flag={flag} />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
          <Activity className="w-3 h-3 inline mr-1" />
          Generated by MDT Triage Engine based on FHIR observation thresholds
        </div>
      </CardContent>
    </Card>
  );
}
