import {
  VITAL_SIGNS_LOINC,
  NEUROREHAB_LOINC,
  MENTAL_HEALTH_LOINC,
  SIS_LOINC,
  PHARMACOGENOMICS_LOINC,
  GUT_BIOME_LOINC,
  NEUROINFLAMMATION_LOINC,
} from '../config/fhir.config';

export interface ObservationData {
  code: string;
  display: string;
  value: number;
  unit: string;
  date: string;
  effectiveDateTime: string;
}

export interface VitalSign {
  code: string;
  display: string;
  value: number;
  unit: string;
  date: string;
  systolic?: number;
  diastolic?: number;
}

export interface FuglMeyerScore {
  upper: number;
  lower: number;
  total: number;
  date: string;
}

export interface SleepData {
  duration: number;
  quality: number;
  date: string;
}

export interface ReadinessStatus {
  heartRate: 'normal' | 'elevated' | 'low';
  bloodPressure: 'normal' | 'elevated' | 'low';
  sleepQuality: 'good' | 'moderate' | 'poor';
  fatigue: 'none' | 'mild' | 'moderate' | 'severe';
  overall: 'ready' | 'caution' | 'defer';
  reasons: string[];
}

// MDT Interfaces
export interface MentalHealthAssessment {
  type: 'PHQ-9' | 'GAD-7' | 'GDS-15';
  score: number;
  severity: 'none' | 'mild' | 'moderate' | 'moderate_severe' | 'severe';
  date: string;
}

export interface SISDomainScores {
  strength: number;
  handFunction: number;
  mobility: number;
  emotion: number;
  communication: number;
  adl: number;
  memory: number;
  participation: number;
  recovery: number;
  date: string;
}

export interface PharmacogenomicsProfile {
  gene: string;
  phenotype: string;
  clinicalImpact: string;
  medications?: string[];
}

export interface GutBiomeMetrics {
  dysbiosisIndex: number;
  scfaTotal: number;
  butyrate: number;
  zonulin: number;
  calprotectin: number;
  date: string;
}

export interface NeuroinflammationProfile {
  crp?: number;
  il6?: number;
  tnfAlpha?: number;
  nfl?: number;
  gfap?: number;
  date: string;
}

const LOINC_DISPLAY_NAMES: Record<string, string> = {
  [VITAL_SIGNS_LOINC.HEART_RATE]: 'Heart Rate',
  [VITAL_SIGNS_LOINC.TEMPERATURE]: 'Temperature',
  [VITAL_SIGNS_LOINC.RESPIRATORY_RATE]: 'Respiratory Rate',
  [VITAL_SIGNS_LOINC.OXYGEN_SATURATION]: 'Oxygen Saturation',
  [VITAL_SIGNS_LOINC.SYSTOLIC_BP]: 'Systolic BP',
  [VITAL_SIGNS_LOINC.DIASTOLIC_BP]: 'Diastolic BP',
  [VITAL_SIGNS_LOINC.HEIGHT]: 'Height',
  [VITAL_SIGNS_LOINC.WEIGHT]: 'Weight',
  [VITAL_SIGNS_LOINC.BMI]: 'BMI',
  [NEUROREHAB_LOINC.FUGL_MEYER_UPPER]: 'Fugl-Meyer Upper Extremity',
  [NEUROREHAB_LOINC.FUGL_MEYER_LOWER]: 'Fugl-Meyer Lower Extremity',
  [NEUROREHAB_LOINC.FUGL_MEYER_TOTAL]: 'Fugl-Meyer Total',
  [NEUROREHAB_LOINC.FATIGUE_SEVERITY]: 'Fatigue Severity',
  [NEUROREHAB_LOINC.PAIN_INTENSITY]: 'Pain Intensity',
  [NEUROREHAB_LOINC.SLEEP_DURATION]: 'Sleep Duration',
  [NEUROREHAB_LOINC.SLEEP_QUALITY]: 'Sleep Quality',
  // Mental Health
  [MENTAL_HEALTH_LOINC.PHQ9]: 'PHQ-9 Depression',
  [MENTAL_HEALTH_LOINC.GAD7]: 'GAD-7 Anxiety',
  [MENTAL_HEALTH_LOINC.GDS15]: 'Geriatric Depression Scale',
  [MENTAL_HEALTH_LOINC.MOCA]: 'MoCA Cognitive',
  [MENTAL_HEALTH_LOINC.NIHSS]: 'NIH Stroke Scale',
  // SIS Domains
  [SIS_LOINC.PARENT]: 'Stroke Impact Scale',
  [SIS_LOINC.STRENGTH]: 'SIS Strength',
  [SIS_LOINC.HAND_FUNCTION]: 'SIS Hand Function',
  [SIS_LOINC.MOBILITY]: 'SIS Mobility',
  [SIS_LOINC.EMOTION]: 'SIS Emotion',
  [SIS_LOINC.COMMUNICATION]: 'SIS Communication',
  [SIS_LOINC.ADL]: 'SIS ADL/IADL',
  [SIS_LOINC.MEMORY]: 'SIS Memory',
  [SIS_LOINC.PARTICIPATION]: 'SIS Participation',
  [SIS_LOINC.RECOVERY]: 'SIS Recovery',
  // Pharmacogenomics
  [PHARMACOGENOMICS_LOINC.CYP2C19]: 'CYP2C19 Metabolism',
  [PHARMACOGENOMICS_LOINC.CYP2D6]: 'CYP2D6 Metabolism',
  [PHARMACOGENOMICS_LOINC.CYP3A4]: 'CYP3A4 Metabolism',
  [PHARMACOGENOMICS_LOINC.MTHFR_C677T]: 'MTHFR C677T',
  [PHARMACOGENOMICS_LOINC.MTHFR_A1298C]: 'MTHFR A1298C',
  [PHARMACOGENOMICS_LOINC.VKORC1]: 'VKORC1 Warfarin Sensitivity',
  [PHARMACOGENOMICS_LOINC.DPYD]: 'DPYD',
  [PHARMACOGENOMICS_LOINC.TPMT]: 'TPMT',
  [PHARMACOGENOMICS_LOINC.SLCO1B1]: 'SLCO1B1 Statin Risk',
  // Gut Biome
  [GUT_BIOME_LOINC.DYSBIOSIS_INDEX]: 'Gut Dysbiosis Index',
  [GUT_BIOME_LOINC.SCFA_TOTAL]: 'Short-Chain Fatty Acids',
  [GUT_BIOME_LOINC.BUTYRATE]: 'Butyrate',
  [GUT_BIOME_LOINC.ZONULIN]: 'Zonulin (Gut Permeability)',
  [GUT_BIOME_LOINC.CALPROTECTIN]: 'Fecal Calprotectin',
  [GUT_BIOME_LOINC.LIPOPOLYSACCHARIDE]: 'LPS Endotoxin',
  // Neuroinflammation
  [NEUROINFLAMMATION_LOINC.CRP_HIGH_SENSITIVITY]: 'hs-CRP',
  [NEUROINFLAMMATION_LOINC.IL6]: 'Interleukin-6',
  [NEUROINFLAMMATION_LOINC.TNF_ALPHA]: 'TNF-alpha',
  [NEUROINFLAMMATION_LOINC.NEUROFILAMENT_LIGHT]: 'Neurofilament Light',
  [NEUROINFLAMMATION_LOINC.GFAP]: 'GFAP',
};

export function parseObservation(observation: fhir.Observation): ObservationData | null {
  const code = observation.code?.coding?.[0]?.code || '';
  const effectiveDate = observation.effectiveDateTime || observation.effectivePeriod?.start || '';

  if (!code || !effectiveDate) return null;

  const value = observation.valueQuantity?.value || observation.valueInteger || 0;
  const unit = observation.valueQuantity?.unit || '';
  const display = LOINC_DISPLAY_NAMES[code] || observation.code?.text || code;

  return {
    code,
    display,
    value: typeof value === 'number' ? value : 0,
    unit,
    date: new Date(effectiveDate).toLocaleDateString(),
    effectiveDateTime: effectiveDate,
  };
}

export function groupObservationsByCode(observations: fhir.Observation[]): Map<string, ObservationData[]> {
  const grouped = new Map<string, ObservationData[]>();

  observations.forEach(obs => {
    const parsed = parseObservation(obs);
    if (parsed) {
      const existing = grouped.get(parsed.code) || [];
      existing.push(parsed);
      grouped.set(parsed.code, existing);
    }
  });

  return grouped;
}

export function getLatestVitalSigns(observations: fhir.Observation[]): VitalSign[] {
  const grouped = groupObservationsByCode(observations);
  const vitals: VitalSign[] = [];

  const vitalCodes = Object.values(VITAL_SIGNS_LOINC);
  vitalCodes.forEach(code => {
    const obs = grouped.get(code);
    if (obs && obs.length > 0) {
      const latest = obs.sort((a, b) =>
        new Date(b.effectiveDateTime).getTime() - new Date(a.effectiveDateTime).getTime()
      )[0];

      if (code === VITAL_SIGNS_LOINC.SYSTOLIC_BP) {
        const diastolicObs = grouped.get(VITAL_SIGNS_LOINC.DIASTOLIC_BP);
        const latestDiastolic = diastolicObs?.sort((a, b) =>
          new Date(b.effectiveDateTime).getTime() - new Date(a.effectiveDateTime).getTime()
        )[0];

        vitals.push({
          code: '55284-4',
          display: 'Blood Pressure',
          value: 0,
          unit: 'mmHg',
          date: latest.date,
          systolic: latest.value,
          diastolic: latestDiastolic?.value,
        });
      } else if (code !== VITAL_SIGNS_LOINC.DIASTOLIC_BP) {
        vitals.push({
          code: latest.code,
          display: latest.display,
          value: latest.value,
          unit: latest.unit,
          date: latest.date,
        });
      }
    }
  });

  return vitals;
}

export function getFuglMeyerScores(observations: fhir.Observation[]): FuglMeyerScore[] {
  const grouped = groupObservationsByCode(observations);

  const upperScores = grouped.get(NEUROREHAB_LOINC.FUGL_MEYER_UPPER) || [];
  const lowerScores = grouped.get(NEUROREHAB_LOINC.FUGL_MEYER_LOWER) || [];
  const totalScores = grouped.get(NEUROREHAB_LOINC.FUGL_MEYER_TOTAL) || [];

  const scoreMap = new Map<string, FuglMeyerScore>();

  const ensureDate = (dateKey: string, displayDate: string) => {
    if (!scoreMap.has(dateKey)) {
      scoreMap.set(dateKey, { upper: 0, lower: 0, total: 0, date: displayDate });
    }
  };

  upperScores.forEach(score => {
    const date = score.effectiveDateTime.split('T')[0];
    ensureDate(date, score.date);
    scoreMap.get(date)!.upper = score.value;
  });

  lowerScores.forEach(score => {
    const date = score.effectiveDateTime.split('T')[0];
    ensureDate(date, score.date);
    scoreMap.get(date)!.lower = score.value;
  });

  totalScores.forEach(score => {
    const date = score.effectiveDateTime.split('T')[0];
    ensureDate(date, score.date);
    scoreMap.get(date)!.total = score.value;
  });

  // If total wasn't recorded separately, derive it from upper + lower
  scoreMap.forEach(entry => {
    if (entry.total === 0 && (entry.upper > 0 || entry.lower > 0)) {
      entry.total = entry.upper + entry.lower;
    }
  });

  return Array.from(scoreMap.values()).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getSleepData(observations: fhir.Observation[]): SleepData[] {
  const grouped = groupObservationsByCode(observations);

  const durationScores = grouped.get(NEUROREHAB_LOINC.SLEEP_DURATION) || [];
  const qualityScores = grouped.get(NEUROREHAB_LOINC.SLEEP_QUALITY) || [];

  const sleepMap = new Map<string, SleepData>();

  const ensureDate = (dateKey: string, displayDate: string) => {
    if (!sleepMap.has(dateKey)) {
      sleepMap.set(dateKey, { duration: 0, quality: 0, date: displayDate });
    }
  };

  durationScores.forEach(score => {
    const date = score.effectiveDateTime.split('T')[0];
    ensureDate(date, score.date);
    sleepMap.get(date)!.duration = score.value;
  });

  qualityScores.forEach(score => {
    const date = score.effectiveDateTime.split('T')[0];
    ensureDate(date, score.date);
    sleepMap.get(date)!.quality = score.value;
  });

  return Array.from(sleepMap.values()).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Returns the most recent observation matching a LOINC code, regardless of age.
// If older than staleHours, appends a stale note to reasons.
function latestObs(
  observations: fhir.Observation[],
  code: string,
  staleHours: number,
  reasons: string[],
  staleLabel: string
): fhir.Observation | undefined {
  const matches = observations
    .filter(o => o.code?.coding?.[0]?.code === code)
    .sort((a, b) => {
      const da = new Date(a.effectiveDateTime || a.effectivePeriod?.start || 0).getTime();
      const db = new Date(b.effectiveDateTime || b.effectivePeriod?.start || 0).getTime();
      return db - da;
    });

  if (matches.length === 0) return undefined;

  const obs = matches[0];
  const age = Date.now() - new Date(obs.effectiveDateTime || obs.effectivePeriod?.start || 0).getTime();
  if (age > staleHours * 60 * 60 * 1000) {
    reasons.push(`${staleLabel} data is more than ${staleHours}h old — verify before session`);
  }
  return obs;
}

export function assessReadiness(observations: fhir.Observation[]): ReadinessStatus {
  const reasons: string[] = [];
  let heartRate: 'normal' | 'elevated' | 'low' = 'normal';
  let bloodPressure: 'normal' | 'elevated' | 'low' = 'normal';
  let sleepQuality: 'good' | 'moderate' | 'poor' = 'good';
  let fatigue: 'none' | 'mild' | 'moderate' | 'severe' = 'none';

  const hrObs = latestObs(observations, VITAL_SIGNS_LOINC.HEART_RATE, 24, reasons, 'Heart rate');
  if (hrObs?.valueQuantity?.value) {
    const hr = hrObs.valueQuantity.value;
    if (hr > 100) {
      heartRate = 'elevated';
      reasons.push('Elevated heart rate');
    } else if (hr < 50) {
      heartRate = 'low';
      reasons.push('Low heart rate');
    }
  }

  const systolicObs = latestObs(observations, VITAL_SIGNS_LOINC.SYSTOLIC_BP, 24, reasons, 'Blood pressure');
  if (systolicObs?.valueQuantity?.value) {
    const sbp = systolicObs.valueQuantity.value;
    if (sbp > 140) {
      bloodPressure = 'elevated';
      reasons.push('Elevated blood pressure');
    } else if (sbp < 90) {
      bloodPressure = 'low';
      reasons.push('Low blood pressure');
    }
  }

  const sleepQualityObs = latestObs(observations, NEUROREHAB_LOINC.SLEEP_QUALITY, 36, reasons, 'Sleep quality');
  if (sleepQualityObs?.valueQuantity?.value) {
    const quality = sleepQualityObs.valueQuantity.value;
    if (quality < 5) {
      sleepQuality = 'poor';
      reasons.push('Poor sleep quality last night');
    } else if (quality < 7) {
      sleepQuality = 'moderate';
    }
  }

  const fatigueObs = latestObs(observations, NEUROREHAB_LOINC.FATIGUE_SEVERITY, 24, reasons, 'Fatigue');
  if (fatigueObs?.valueQuantity?.value) {
    const fatigueScore = fatigueObs.valueQuantity.value;
    if (fatigueScore > 7) {
      fatigue = 'severe';
      reasons.push('Severe fatigue reported');
    } else if (fatigueScore > 5) {
      fatigue = 'moderate';
      reasons.push('Moderate fatigue reported');
    } else if (fatigueScore > 3) {
      fatigue = 'mild';
    }
  }

  let overall: 'ready' | 'caution' | 'defer' = 'ready';
  if (reasons.length >= 2) {
    overall = 'defer';
  } else if (reasons.length === 1) {
    overall = 'caution';
  }

  return {
    heartRate,
    bloodPressure,
    sleepQuality,
    fatigue,
    overall,
    reasons,
  };
}

// ========== MDT Utility Functions ==========

// Get PHQ-9 depression scores
export function getPHQ9Scores(observations: fhir.Observation[]): MentalHealthAssessment[] {
  const grouped = groupObservationsByCode(observations);
  const scores = grouped.get(MENTAL_HEALTH_LOINC.PHQ9) || [];

  return scores.map(s => {
    const score = s.value;
    let severity: MentalHealthAssessment['severity'];
    if (score <= 4) severity = 'none';
    else if (score <= 9) severity = 'mild';
    else if (score <= 14) severity = 'moderate';
    else if (score <= 19) severity = 'moderate_severe';
    else severity = 'severe';

    return {
      type: 'PHQ-9',
      score,
      severity,
      date: s.date,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get GAD-7 anxiety scores
export function getGAD7Scores(observations: fhir.Observation[]): MentalHealthAssessment[] {
  const grouped = groupObservationsByCode(observations);
  const scores = grouped.get(MENTAL_HEALTH_LOINC.GAD7) || [];

  return scores.map(s => {
    const score = s.value;
    let severity: MentalHealthAssessment['severity'];
    if (score <= 4) severity = 'none';
    else if (score <= 9) severity = 'mild';
    else if (score <= 14) severity = 'moderate';
    else severity = 'severe';

    return {
      type: 'GAD-7',
      score,
      severity,
      date: s.date,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get GDS-15 geriatric depression scores
export function getGDS15Scores(observations: fhir.Observation[]): MentalHealthAssessment[] {
  const grouped = groupObservationsByCode(observations);
  const scores = grouped.get(MENTAL_HEALTH_LOINC.GDS15) || [];

  return scores.map(s => {
    const score = s.value;
    let severity: MentalHealthAssessment['severity'];
    if (score <= 4) severity = 'none';
    else if (score <= 9) severity = 'mild';
    else if (score <= 13) severity = 'moderate';
    else severity = 'severe';

    return {
      type: 'GDS-15',
      score,
      severity,
      date: s.date,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get Stroke Impact Scale domain scores from component-based observation
export function getSISDomainScores(observations: fhir.Observation[]): SISDomainScores[] {
  const sisObs = observations.filter(o =>
    o.code?.coding?.[0]?.code === SIS_LOINC.PARENT && o.component && o.component.length > 0
  );

  return sisObs.map(obs => {
    const getComponentValue = (code: string): number => {
      const comp = obs.component?.find(c => c.code?.coding?.[0]?.code === code);
      return comp?.valueQuantity?.value || comp?.valueInteger || 0;
    };

    return {
      strength: getComponentValue(SIS_LOINC.STRENGTH),
      handFunction: getComponentValue(SIS_LOINC.HAND_FUNCTION),
      mobility: getComponentValue(SIS_LOINC.MOBILITY),
      emotion: getComponentValue(SIS_LOINC.EMOTION),
      communication: getComponentValue(SIS_LOINC.COMMUNICATION),
      adl: getComponentValue(SIS_LOINC.ADL),
      memory: getComponentValue(SIS_LOINC.MEMORY),
      participation: getComponentValue(SIS_LOINC.PARTICIPATION),
      recovery: getComponentValue(SIS_LOINC.RECOVERY),
      date: new Date(obs.effectiveDateTime || '').toLocaleDateString(),
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get pharmacogenomics profile from observations
export function getPharmacogenomicsProfile(observations: fhir.Observation[]): PharmacogenomicsProfile[] {
  const profiles: PharmacogenomicsProfile[] = [];

  const genes: Array<{ code: string; name: string; meds?: string[] }> = [
    { code: PHARMACOGENOMICS_LOINC.CYP2C19, name: 'CYP2C19', meds: ['Clopidogrel (Plavix)', 'PPIs', 'Antidepressants'] },
    { code: PHARMACOGENOMICS_LOINC.CYP2D6, name: 'CYP2D6', meds: ['Codeine', 'Tamoxifen', 'Antidepressants'] },
    { code: PHARMACOGENOMICS_LOINC.CYP3A4, name: 'CYP3A4', meds: ['Statins', 'Calcium channel blockers'] },
    { code: PHARMACOGENOMICS_LOINC.VKORC1, name: 'VKORC1', meds: ['Warfarin'] },
    { code: PHARMACOGENOMICS_LOINC.SLCO1B1, name: 'SLCO1B1', meds: ['Simvastatin', 'Atorvastatin'] },
    { code: PHARMACOGENOMICS_LOINC.MTHFR_C677T, name: 'MTHFR C677T', meds: ['Folate', 'Methylation support'] },
  ];

  for (const gene of genes) {
    const obs = observations.find(o => o.code?.coding?.[0]?.code === gene.code);
    if (obs?.valueCodeableConcept?.coding?.[0]?.display) {
      profiles.push({
        gene: gene.name,
        phenotype: obs.valueCodeableConcept.coding[0].display,
        clinicalImpact: obs.note?.[0]?.text || '',
        medications: gene.meds,
      });
    }
  }

  return profiles;
}

// Get gut biome metrics
export function getGutBiomeMetrics(observations: fhir.Observation[]): GutBiomeMetrics | null {
  const grouped = groupObservationsByCode(observations);

  const dysbiosis = grouped.get(GUT_BIOME_LOINC.DYSBIOSIS_INDEX)?.[0];
  if (!dysbiosis) return null;

  const scfa = grouped.get(GUT_BIOME_LOINC.SCFA_TOTAL)?.[0];
  const butyrate = grouped.get(GUT_BIOME_LOINC.BUTYRATE)?.[0];
  const zonulin = grouped.get(GUT_BIOME_LOINC.ZONULIN)?.[0];
  const calprotectin = grouped.get(GUT_BIOME_LOINC.CALPROTECTIN)?.[0];

  return {
    dysbiosisIndex: dysbiosis.value,
    scfaTotal: scfa?.value || 0,
    butyrate: butyrate?.value || 0,
    zonulin: zonulin?.value || 0,
    calprotectin: calprotectin?.value || 0,
    date: dysbiosis.date,
  };
}

// Get neuroinflammation profile
export function getNeuroinflammationProfile(observations: fhir.Observation[]): NeuroinflammationProfile | null {
  const grouped = groupObservationsByCode(observations);

  const crp = grouped.get(NEUROINFLAMMATION_LOINC.CRP_HIGH_SENSITIVITY)?.[0];
  const il6 = grouped.get(NEUROINFLAMMATION_LOINC.IL6)?.[0];
  const tnf = grouped.get(NEUROINFLAMMATION_LOINC.TNF_ALPHA)?.[0];
  const nfl = grouped.get(NEUROINFLAMMATION_LOINC.NEUROFILAMENT_LIGHT)?.[0];
  const gfap = grouped.get(NEUROINFLAMMATION_LOINC.GFAP)?.[0];

  if (!crp && !il6 && !tnf && !nfl && !gfap) return null;

  return {
    crp: crp?.value,
    il6: il6?.value,
    tnfAlpha: tnf?.value,
    nfl: nfl?.value,
    gfap: gfap?.value,
    date: (crp || il6 || tnf || nfl || gfap)?.date || '',
  };
}

// Generate automated clinical flags based on MDT data
export interface ClinicalFlag {
  id: string;
  category: 'clinical' | 'medication' | 'safety' | 'behavioral';
  severity: 'high' | 'moderate' | 'low';
  title: string;
  description: string;
  recommendation?: string;
}

export function generateClinicalFlags(
  observations: fhir.Observation[],
  phq9: MentalHealthAssessment | null,
  gad7: MentalHealthAssessment | null,
  gutBiome: GutBiomeMetrics | null,
  neuroinflammation: NeuroinflammationProfile | null,
  pgxProfiles: PharmacogenomicsProfile[]
): ClinicalFlag[] {
  const flags: ClinicalFlag[] = [];

  // Depression Risk Flag
  if (phq9 && phq9.score >= 15) {
    flags.push({
      id: 'flag-depression',
      category: 'behavioral',
      severity: phq9.score >= 20 ? 'high' : 'moderate',
      title: 'High Depression Risk',
      description: `PHQ-9 score of ${phq9.score} indicates ${phq9.severity.replace('_', '-')} depression`,
      recommendation: 'Consider psychiatry consult and antidepressant therapy review',
    });
  }

  // Anxiety Risk Flag
  if (gad7 && gad7.score >= 10) {
    flags.push({
      id: 'flag-anxiety',
      category: 'behavioral',
      severity: gad7.score >= 15 ? 'high' : 'moderate',
      title: 'Elevated Anxiety',
      description: `GAD-7 score of ${gad7.score} indicates ${gad7.severity} anxiety`,
      recommendation: 'Evaluate anxiolytic therapy and coping strategies',
    });
  }

  // Pharmacogenomics Medication Risk
  const pgxCritical = pgxProfiles.filter(p =>
    p.phenotype.toLowerCase().includes('poor') ||
    p.phenotype.toLowerCase().includes('reduced')
  );
  if (pgxCritical.length > 0) {
    flags.push({
      id: 'flag-pgx-risk',
      category: 'medication',
      severity: 'high',
      title: 'Pharmacogenomic Alert',
      description: `${pgxCritical.length} gene variant(s) affecting drug metabolism: ${pgxCritical.map(p => p.gene).join(', ')}`,
      recommendation: 'Review medication list for gene-drug interactions',
    });
  }

  // MTHFR Risk Flag
  const mthfr = pgxProfiles.find(p => p.gene.startsWith('MTHFR'));
  if (mthfr && mthfr.phenotype.toLowerCase().includes('variant')) {
    flags.push({
      id: 'flag-mthfr',
      category: 'clinical',
      severity: 'moderate',
      title: 'MTHFR Variant Detected',
      description: mthfr.clinicalImpact || 'MTHFR polymorphism may affect methylation and folate metabolism',
      recommendation: 'Consider methylfolate supplementation and homocysteine monitoring',
    });
  }

  // Gut Dysbiosis + Inflammation Risk
  if (gutBiome && gutBiome.dysbiosisIndex > 3 && neuroinflammation?.crp && neuroinflammation.crp > 3) {
    flags.push({
      id: 'flag-gut-inflammation',
      category: 'clinical',
      severity: 'high',
      title: 'Gut-Brain Axis Alert',
      description: `High gut dysbiosis (${gutBiome.dysbiosisIndex.toFixed(1)}) with elevated hs-CRP (${neuroinflammation.crp.toFixed(1)} mg/L) suggests systemic inflammation`,
      recommendation: 'Consider microbiome intervention, anti-inflammatory diet, and probiotic therapy',
    });
  }

  // Leaky Gut Risk
  if (gutBiome && gutBiome.zonulin > 2.5) {
    flags.push({
      id: 'flag-leaky-gut',
      category: 'clinical',
      severity: 'moderate',
      title: 'Elevated Intestinal Permeability',
      description: `Zonulin level ${gutBiome.zonulin.toFixed(2)} indicates compromised gut barrier`,
      recommendation: 'Gastroenterology consult, consider elimination diet',
    });
  }

  // Neuroinflammation Risk
  if (neuroinflammation) {
    const elevatedMarkers = [];
    if (neuroinflammation.crp && neuroinflammation.crp > 5) elevatedMarkers.push('hs-CRP');
    if (neuroinflammation.il6 && neuroinflammation.il6 > 5) elevatedMarkers.push('IL-6');
    if (neuroinflammation.tnfAlpha && neuroinflammation.tnfAlpha > 10) elevatedMarkers.push('TNF-alpha');
    if (neuroinflammation.nfl && neuroinflammation.nfl > 20) elevatedMarkers.push('NfL');
    if (neuroinflammation.gfap && neuroinflammation.gfap > 150) elevatedMarkers.push('GFAP');

    if (elevatedMarkers.length >= 2) {
      flags.push({
        id: 'flag-neuroinflammation',
        category: 'clinical',
        severity: 'high',
        title: 'Neuroinflammation Alert',
        description: `Elevated inflammatory markers: ${elevatedMarkers.join(', ')}`,
        recommendation: 'Consider anti-inflammatory therapy, monitor neuroprotection',
      });
    }
  }

  return flags.sort((a, b) => {
    const severityOrder = { high: 0, moderate: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}
