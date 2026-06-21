import { Dna, AlertTriangle, Pill, CheckCircle, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { getPharmacogenomicsProfile, PharmacogenomicsProfile } from '../utils/observationUtils';

interface PharmacogenomicsPanelProps {
  observations: fhir.Observation[];
}

function GeneCard({ profile }: { profile: PharmacogenomicsProfile }) {
  const isPoor = profile.phenotype.toLowerCase().includes('poor');
  const isReduced = profile.phenotype.toLowerCase().includes('reduced');
  const isUltra = profile.phenotype.toLowerCase().includes('ultra');
  const isNormal = profile.phenotype.toLowerCase().includes('normal') ||
                   profile.phenotype.toLowerCase().includes('extensive');

  const severity: 'danger' | 'warning' | 'success' = isPoor || isUltra ? 'danger' :
                                                       isReduced ? 'warning' :
                                                       'success';

  const getRiskIcon = () => {
    if (isPoor) return <AlertTriangle className="w-4 h-4 text-red-600" />;
    if (isReduced) return <Info className="w-4 h-4 text-amber-600" />;
    if (isUltra) return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getRiskIcon()}
          <span className="font-mono text-sm font-bold text-gray-900">{profile.gene}</span>
        </div>
        <Badge variant={severity} size="sm">{profile.phenotype}</Badge>
      </div>

      <p className="text-xs text-gray-600 mb-2">{profile.clinicalImpact || 'No clinical notes available'}</p>

      {profile.medications && profile.medications.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {profile.medications.map((med, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Pill className="w-3 h-3" />
              {med}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function PharmacogenomicsPanel({ observations }: PharmacogenomicsPanelProps) {
  const profiles = getPharmacogenomicsProfile(observations);

  const criticalProfiles = profiles.filter(p =>
    p.phenotype.toLowerCase().includes('poor') ||
    p.phenotype.toLowerCase().includes('ultra') ||
    p.phenotype.toLowerCase().includes('reduced')
  );

  const hasCritical = criticalProfiles.length > 0;

  if (profiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-green-600" />
            Pharmacogenomics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Dna className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No pharmacogenomic data available</p>
            <p className="text-xs text-gray-400 mt-1">
              Genetic metabolism profiles will appear here
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
            <Dna className="w-5 h-5 text-green-600" />
            Pharmacogenomics Profile
          </CardTitle>
          {hasCritical && (
            <Badge variant="danger">{criticalProfiles.length} Action Required</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {hasCritical && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">Medication-Gene Interactions Detected</p>
                <p className="text-xs text-red-700 mt-1">
                  {criticalProfiles.map(p => p.gene).join(', ')} variants may affect drug metabolism.
                  Review medication list with pharmacy consult.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {profiles.map((profile, idx) => (
            <GeneCard key={idx} profile={profile} />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <Info className="w-3 h-3 inline mr-1" />
            Pharmacogenomics data guides medication selection based on individual genetic variants
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
