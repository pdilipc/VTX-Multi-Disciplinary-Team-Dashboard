import { useState, useEffect } from 'react';
import { Settings, Bell, HelpCircle } from 'lucide-react';
import { Sidebar, TriageCategory } from './components/Sidebar';
import { PatientRoster } from './components/PatientRoster';
import { PatientDetails } from './components/PatientDetails';
import { SessionPlanner } from './components/SessionPlanner';
import { SessionDocumentation } from './components/SessionDocumentation';
import { NeuroRehabTriage } from './components/NeuroRehabTriage';
import { AcuteDeteriorationTriage } from './components/AcuteDeteriorationTriage';
import { PlaceholderTriage } from './components/PlaceholderTriage';
import { MDTSummaryDashboard } from './components/MDTSummaryDashboard';
import { FhirTerminal } from './components/FhirTerminal';
import { fhirService } from './services/fhir.service';
import { useObservations } from './hooks/usePatients';

type View = 'list' | 'details' | 'session' | 'documentation';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<TriageCategory>('roster');
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<fhir.Patient | null>(null);
  const [observations, setObservations] = useState<fhir.Observation[]>([]);
  const [sessionDecision, setSessionDecision] = useState<'proceed' | 'modify' | 'defer' | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentView('details');
  };

  const handleStartSession = () => {
    setCurrentView('session');
  };

  const handleDocumentSession = (decision: 'proceed' | 'modify' | 'defer') => {
    setSessionDecision(decision);
    setCurrentView('documentation');
  };

  const handleComplete = () => {
    setCurrentView('list');
    setSelectedPatientId(null);
    setSelectedPatient(null);
    setObservations([]);
    setSessionDecision(null);
  };

  const handleBackToList = () => {
    setCurrentView('list');
  };

  const handleCategoryChange = (category: TriageCategory) => {
    setActiveCategory(category);
    setCurrentView('list');
    setSelectedPatientId(null);
    setSelectedPatient(null);
    setObservations([]);
  };

  // Load patient data when patient is selected
  useEffect(() => {
    const loadPatientData = async () => {
      if (selectedPatientId && currentView === 'details') {
        try {
          const patient = await fhirService.getPatient(selectedPatientId);
          setSelectedPatient(patient);

          const obsBundle = await fhirService.getObservations(selectedPatientId);
          const obsList = obsBundle.entry?.map((e: { resource?: fhir.Resource }) => e.resource as fhir.Observation).filter(Boolean) || [];
          setObservations(obsList);
        } catch (err) {
          console.error('Failed to load patient data:', err);
        }
      }
    };

    loadPatientData();
  }, [selectedPatientId, currentView]);

  const renderTriageContent = () => {
    if (activeCategory !== 'roster' && currentView !== 'list') {
      // Handle other views
    }

    if (currentView === 'details' && selectedPatientId) {
      return (
        <PatientDetails
          patientId={selectedPatientId}
          onBack={handleBackToList}
          onStartSession={handleStartSession}
        />
      );
    }

    if (currentView === 'session' && selectedPatient) {
      return (
        <SessionPlanner
          patient={selectedPatient}
          observations={observations}
          onBack={handleBackToList}
          onDocument={handleDocumentSession}
        />
      );
    }

    if (currentView === 'documentation' && selectedPatient && sessionDecision) {
      return (
        <SessionDocumentation
          patientId={selectedPatientId!}
          patient={selectedPatient}
          decision={sessionDecision}
          onBack={() => setCurrentView('session')}
          onComplete={handleComplete}
        />
      );
    }

    switch (activeCategory) {
      case 'roster':
        return <PatientRoster onSelectPatient={handleSelectPatient} />;
      case 'neurorehab':
        return <NeuroRehabTriage onSelectPatient={handleSelectPatient} />;
      case 'mdt':
        return <MDTTriageView onSelectPatient={handleSelectPatient} />;
      case 'acute':
        return <AcuteDeteriorationTriage />;
      case 'operational':
        return <PlaceholderTriage type="operational" />;
      case 'preventative':
        return <PlaceholderTriage type="preventative" />;
      case 'throughput':
        return <PlaceholderTriage type="throughput" />;
      default:
        return <PatientRoster onSelectPatient={handleSelectPatient} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900">
              {activeCategory === 'roster' && 'Patient Roster'}
              {activeCategory === 'neurorehab' && 'Neuro-Rehab Triage'}
              {activeCategory === 'mdt' && 'MDT Dashboard'}
              {activeCategory === 'acute' && 'Acute Deterioration Triage'}
              {activeCategory === 'operational' && 'Resource Tracking'}
              {activeCategory === 'preventative' && 'Preventative Care'}
              {activeCategory === 'throughput' && 'Discharge Planning'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderTriageContent()}
        </main>

        <footer className="bg-white border-t border-gray-200 px-6 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Verada NeuroRehab Readiness Application</span>
            <span>FHIR R4 Integrated Platform | Connected to sandbox</span>
          </div>
        </footer>
      </div>

      <FhirTerminal isOpen={terminalOpen} onToggle={() => setTerminalOpen(!terminalOpen)} />
    </div>
  );
}

// MDT Triage View Component
function MDTTriageView({ onSelectPatient }: { onSelectPatient: (patientId: string) => void }) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const { observations, loading } = useObservations(selectedPatientId || '');

  // Sample patients for MDT dashboard demonstration
  const samplePatients = [
    { id: 'mdt-sample-1', name: 'Eleanor Vance', condition: 'Left MCA infarct', riskScore: 14 },
    { id: 'mdt-sample-2', name: 'Robert Chen', condition: 'Basilar stroke', riskScore: 8 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">MDT Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Multi-Disciplinary Team holistic monitoring: mental health, pharmacogenomics, gut-brain axis, and stroke impact
        </p>
      </div>

      {!selectedPatientId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {samplePatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => setSelectedPatientId(patient.id)}
              className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-lg hover:border-blue-300 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white font-bold">{patient.name[0]}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${patient.riskScore > 10 ? 'bg-red-100 text-red-700' : patient.riskScore > 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  Risk: {patient.riskScore}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">{patient.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{patient.condition}</p>
              <p className="text-xs text-blue-600 mt-2">View MDT Dashboard</p>
            </button>
          ))}
        </div>
      )}

      {selectedPatientId && (
        <div>
          <button
            onClick={() => setSelectedPatientId(null)}
            className="mb-4 text-sm text-blue-600 hover:text-blue-800"
          >
            Back to patient list
          </button>
          <MDTSummaryDashboard observations={loading ? [] : observations} />
          <div className="mt-4 text-center">
            <button
              onClick={() => onSelectPatient(selectedPatientId)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Go to full patient record
            </button>
          </div>
        </div>
      )}

      {!selectedPatientId && (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">
            Select a patient above to view their MDT Dashboard with mental health assessments,
            pharmacogenomics profiles, gut-brain axis metrics, and stroke impact scales.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
