import { useState } from 'react';
import { NJTabs, NJTab } from '@engie-group/fluid-design-system-react';
import './App.css';
import TopBar from './components/TopBar';
import ProjectCard from './components/ProjectCard';
import DocumentsTab from './components/DocumentsTab';
import AgentsTab from './components/AgentsTab';
import ResultsModal from './components/ResultsModal';
import ProposalView from './components/ProposalView';

export default function App() {
  const [view, setView] = useState('rfp');
  const [tab, setTab] = useState('documents');
  const [processing, setProcessing] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [proposalStep, setProposalStep] = useState(1);
  const [activeSection, setActiveSection] = useState('3.0');
  const [docExpanded, setDocExpanded] = useState('rfp');
  const [modalTab, setModalTab] = useState('keyinfo');
  const [ph, setPh] = useState({ proj: '', equip: '', mach: '', reg: '' });
  const [editingPH, setEditingPH] = useState(null);
  const [agents, setAgents] = useState({ a1: true, a2: true, a3: true });
  const [tasks, setTasks] = useState({ tki: true, paa: true });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleAddFiles = (fileList) => {
    const allowed = ['.pdf', '.docx'];
    const newFiles = Array.from(fileList).filter((f) => {
      const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
      return allowed.includes(ext);
    });
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenPrev = (d) => {
    if (previewDoc === d) {
      setShowPreview((v) => !v);
    } else {
      setPreviewDoc(d);
      setShowPreview(true);
    }
  };

  const handleStartProc = () => {
    if (!processing) {
      setProcessing(true);
      setTab('agents');
    }
  };

  const handleTogExp = (d) => {
    setDocExpanded(docExpanded === d ? null : d);
  };

  const handleTogAgent = (id) => {
    setAgents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTogTask = (id) => {
    setTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLaunchProp = () => {
    setView('proposal');
    setProposalStep(1);
    setActiveSection('3.0');
  };

  const handlePhChange = (id, val) => {
    setPh((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <>
      <TopBar view={view} onGoView={setView} />

      {view === 'rfp' ? (
        <div>
          <ProjectCard />
          <div style={{ padding: '0 20px' }}>
            <NJTabs label="Project tabs" activeTab={tab} onClickTabItem={(id) => setTab(id)}>
              <NJTab id="documents" label="Documents" />
              <NJTab id="agents" label="Agents & Results" />
            </NJTabs>
          </div>
          {tab === 'documents' ? (
            <DocumentsTab
              previewDoc={previewDoc}
              showPreview={showPreview}
              processing={processing}
              docExpanded={docExpanded}
              agents={agents}
              tasks={tasks}
              uploadedFiles={uploadedFiles}
              onOpenPrev={handleOpenPrev}
              onClosePrev={() => setShowPreview(false)}
              onTogExp={handleTogExp}
              onStartProc={handleStartProc}
              onTogAgent={handleTogAgent}
              onTogTask={handleTogTask}
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
            />
          ) : (
            <AgentsTab
              processing={processing}
              onOpenRes={() => setShowResults(true)}
              onLaunchProp={handleLaunchProp}
            />
          )}
        </div>
      ) : (
        <ProposalView
          proposalStep={proposalStep}
          activeSection={activeSection}
          ph={ph}
          editingPH={editingPH}
          onGoStep={setProposalStep}
          onSetSection={setActiveSection}
          onStartPH={setEditingPH}
          onStopPH={() => setEditingPH(null)}
          onPhChange={handlePhChange}
        />
      )}

      {showResults && (
        <ResultsModal
          modalTab={modalTab}
          onSetModalTab={setModalTab}
          onClose={() => setShowResults(false)}
        />
      )}
    </>
  );
}
