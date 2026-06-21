export const FHIR_CONFIG = {
  baseUrl: import.meta.env.VITE_FHIR_BASE_URL || '',
  bearerToken: import.meta.env.VITE_FHIR_BEARER_TOKEN || '',
};

export const VITAL_SIGNS_LOINC = {
  HEART_RATE: '8867-4',
  TEMPERATURE: '8310-5',
  RESPIRATORY_RATE: '9279-3',
  OXYGEN_SATURATION: '59408-5',
  SYSTOLIC_BP: '8480-6',
  DIASTOLIC_BP: '8462-4',
  HEIGHT: '8302-2',
  WEIGHT: '29463-7',
  BMI: '39156-5',
};

export const NEUROREHAB_LOINC = {
  FUGL_MEYER_UPPER: '72164-2',
  FUGL_MEYER_LOWER: '72165-9',
  FUGL_MEYER_TOTAL: '72166-7',
  FATIGUE_SEVERITY: '71591-4',
  PAIN_INTENSITY: '72132-0',
  SLEEP_DURATION: '93832-4',
  SLEEP_QUALITY: '93833-2',
};

// Mental Health Assessment LOINC Codes
export const MENTAL_HEALTH_LOINC = {
  PHQ9: '44249-1',           // PHQ-9 quick depression assessment panel
  GAD7: '70274-6',           // GAD-7 anxiety assessment
  GDS15: '42495-5',          // Geriatric Depression Scale-15
  MOCA: '72133-8',           // Montreal Cognitive Assessment
  NIHSS: '70323-0',          // NIH Stroke Scale
};

// Stroke Impact Scale (SIS) Domain LOINC Codes
export const SIS_LOINC = {
  PARENT: '92743-0',                              // SIS Assessment Panel
  STRENGTH: '92744-8',
  HAND_FUNCTION: '92745-5',
  MOBILITY: '92746-3',
  EMOTION: '92747-1',
  COMMUNICATION: '92748-9',
  ADL: '92749-7',
  MEMORY: '92750-5',
  PARTICIPATION: '92751-3',
  RECOVERY: '92752-1',                           // Global Recovery percentage
};

// Pharmacogenomics LOINC Codes
export const PHARMACOGENOMICS_LOINC = {
  CYP2C19: '93534-6',          // CYP2C19 gene targeted mutation analysis
  CYP2D6: '93532-0',           // CYP2D6 gene targeted mutation analysis
  CYP3A4: '93530-4',           // CYP3A4 gene targeted mutation analysis
  MTHFR_C677T: '70343-8',      // MTHFR C677T variant
  MTHFR_A1298C: '70344-6',     // MTHFR A1298C variant
  VKORC1: '93546-0',           // VKORC1 gene analysis (warfarin sensitivity)
  DPYD: '93536-1',             // DPYD gene analysis (5-FU toxicity)
  TPMT: '93538-7',             // TPMT gene analysis (mercapto-purine toxicity)
  SLCO1B1: '93540-3',          // SLCO1B1 gene analysis (statin myopathy)
};

// Gut Biome & Neuroinflammation Biomarkers
export const GUT_BIOME_LOINC = {
  DYSBIOSIS_INDEX: '92785-2',         // Gut dysbiosis index
  SCFA_TOTAL: '92786-0',             // Short-chain fatty acids total
  BUTYRATE: '92787-8',                // Butyrate level
  ZONULIN: '92788-6',                 // Zonulin (intestinal permeability)
  CALPROTECTIN: '92789-4',            // Fecal calprotectin (inflammation)
  LIPOPOLYSACCHARIDE: '92790-2',      // LPS (endotoxin)
};

// Neuroinflammation Markers
export const NEUROINFLAMMATION_LOINC = {
  CRP_HIGH_SENSITIVITY: '30522-7',
  IL6: '92760-5',
  TNF_ALPHA: '92761-3',
  NEUROFILAMENT_LIGHT: '92762-1',
  GFAP: '92763-9',                    // Glial fibrillary acidic protein
};

// MDT Flag Categories (HL7 Code System)
export const FLAG_CATEGORIES = {
  CLINICAL_ALERT: { system: 'http://hl7.org/fhir/flag-category', code: 'clinical', display: 'Clinical Alert' },
  MEDICATION_RISK: { system: 'http://hl7.org/fhir/flag-category', code: 'drug', display: 'Medication Risk' },
  SAFETY: { system: 'http://hl7.org/fhir/flag-category', code: 'safety', display: 'Safety Alert' },
  BEHAVIORAL: { system: 'http://hl7.org/fhir/flag-category', code: 'behavioral', display: 'Behavioral Alert' },
};
