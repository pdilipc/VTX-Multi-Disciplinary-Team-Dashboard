import { Brain, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { getPHQ9Scores, getGAD7Scores, getGDS15Scores, MentalHealthAssessment } from '../utils/observationUtils';

interface MentalHealthPanelProps {
  observations: fhir.Observation[];
}

function AssessmentCard({
  type,
  latest,
  trend,
  color,
  description,
  range,
}: {
  type: string;
  latest: MentalHealthAssessment | null;
  trend: 'up' | 'down' | 'stable';
  color: string;
  description: string;
  range: string;
}) {
  const getSeverityBadge = (severity: MentalHealthAssessment['severity']) => {
    switch (severity) {
      case 'none': return <Badge variant="success">None/Minimal</Badge>;
      case 'mild': return <Badge variant="warning">Mild</Badge>;
      case 'moderate': return <Badge variant="warning">Moderate</Badge>;
      case 'moderate_severe': return <Badge variant="danger">Moderate-Severe</Badge>;
      case 'severe': return <Badge variant="danger">Severe</Badge>;
      default: return <Badge variant="default">N/A</Badge>;
    }
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-400';

  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-4 border border-gray-100`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-gray-600" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{type}</h4>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
      </div>

      {latest ? (
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{latest.score}</span>
            <span className="text-sm text-gray-600">/ {range}</span>
          </div>
          {getSeverityBadge(latest.severity)}
          <p className="text-xs text-gray-500">{latest.date}</p>
        </div>
      ) : (
        <div className="text-center py-4">
          <AlertCircle className="w-6 h-6 text-gray-300 mx-auto mb-1" />
          <p className="text-xs text-gray-400">No assessment recorded</p>
        </div>
      )}
    </div>
  );
}

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;

  const w = 60;
  const h = 20;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const xStep = w / (values.length - 1);

  const pts = values
    .map((v, i) => `${i * xStep},${h - ((v - min) / range) * h * 0.8 - 2}`)
    .join(' ');

  return (
    <svg width={w} height={h} className="inline-block">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function MentalHealthPanel({ observations }: MentalHealthPanelProps) {
  const phq9Scores = getPHQ9Scores(observations);
  const gad7Scores = getGAD7Scores(observations);
  const gds15Scores = getGDS15Scores(observations);

  const latestPHQ9 = phq9Scores[0] || null;
  const latestGAD7 = gad7Scores[0] || null;
  const latestGDS15 = gds15Scores[0] || null;

  const phq9Trend: 'up' | 'down' | 'stable' =
    phq9Scores.length > 1
      ? phq9Scores[0].score > phq9Scores[1].score
        ? 'up'
        : phq9Scores[0].score < phq9Scores[1].score
          ? 'down'
          : 'stable'
      : 'stable';

  const gad7Trend: 'up' | 'down' | 'stable' =
    gad7Scores.length > 1
      ? gad7Scores[0].score > gad7Scores[1].score
        ? 'up'
        : gad7Scores[0].score < gad7Scores[1].score
          ? 'down'
          : 'stable'
      : 'stable';

  const hasAssessments = latestPHQ9 || latestGAD7 || latestGDS15;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Mental Health Assessments
          </CardTitle>
          {hasAssessments && (
            <span className="text-xs text-gray-500">MDT Behavioral Health</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!hasAssessments ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No mental health assessments recorded</p>
            <p className="text-xs text-gray-400 mt-1">
              PHQ-9, GAD-7, and GDS-15 scores will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AssessmentCard
                type="PHQ-9"
                latest={latestPHQ9}
                trend={phq9Trend}
                color="bg-blue-50"
                description="Depression screening"
                range="27"
              />
              <AssessmentCard
                type="GAD-7"
                latest={latestGAD7}
                trend={gad7Trend}
                color="bg-teal-50"
                description="Anxiety screening"
                range="21"
              />
              <AssessmentCard
                type="GDS-15"
                latest={latestGDS15}
                trend="stable"
                color="bg-amber-50"
                description="Geriatric depression"
                range="15"
              />
            </div>

            {/* Trend Charts */}
            {phq9Scores.length > 1 && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Depression Trend (PHQ-9)</h4>
                <div className="flex items-center gap-4">
                  <MiniSparkline values={phq9Scores.slice(0, 6).reverse().map(s => s.score)} color="#3b82f6" />
                  <div className="text-xs text-gray-500">
                    {phq9Scores.length} assessments over time
                  </div>
                </div>
              </div>
            )}

            {gad7Scores.length > 1 && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Anxiety Trend (GAD-7)</h4>
                <div className="flex items-center gap-4">
                  <MiniSparkline values={gad7Scores.slice(0, 6).reverse().map(s => s.score)} color="#14b8a6" />
                  <div className="text-xs text-gray-500">
                    {gad7Scores.length} assessments over time
                  </div>
                </div>
              </div>
            )}

            {(latestPHQ9?.severity === 'moderate_severe' || latestPHQ9?.severity === 'severe') && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Psychiatry Consult Recommended</p>
                    <p className="text-xs text-red-700 mt-1">
                      PHQ-9 score indicates significant depression requiring specialist review
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
