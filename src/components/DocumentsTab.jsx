import { useRef, useState } from 'react';
import { NJButton, NJTag, NJBadge, NJIconButton, NJSpinner, NJCheckbox } from '@engie-group/fluid-design-system-react';
import SkelLines from './SkelLines';

function RfpPreview() {
  const keyDates = [
    ['RFP Issue', '2024-03-01', 'Tractebel'],
    ['Q&A Deadline', '2024-03-22', 'All parties'],
    ['Bid Submission', '2024-04-15', 'Contractors'],
    ['Award Notice', '2024-05-10', 'Tractebel'],
  ];
  const turbines = [
    ['Rated Power', '15 MW'],
    ['Rotor Diameter', '236 m'],
    ['Hub Height', '150 m'],
  ];

  return (
    <>
      <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Section A — Technical Scope</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['Offshore Wind', 'North Sea', 'Phase IV'].map((t) => (
          <NJTag key={t} scale="sm" variant="brand">{t}</NJTag>
        ))}
      </div>
      <div style={{ height: 1, background: '#E2EBF3', marginBottom: 16 }} />

      <div style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 7, paddingBottom: 5, borderBottom: '1px solid #E2EBF3' }}>1. Submission Requirements</h3>
        <SkelLines n={3} />
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Key Dates</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={{ textAlign: 'left', padding: '5px 10px', borderBottom: '1px solid #E2EBF3', fontWeight: 600 }}>Milestone</th>
                <th style={{ textAlign: 'left', padding: '5px 10px', borderBottom: '1px solid #E2EBF3', fontWeight: 600 }}>Date</th>
                <th style={{ textAlign: 'left', padding: '5px 10px', borderBottom: '1px solid #E2EBF3', fontWeight: 600 }}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {keyDates.map(([m, d, o]) => (
                <tr key={m} className="hover-row">
                  <td style={{ padding: '5px 10px', borderBottom: '1px solid #E2EBF3' }}>{m}</td>
                  <td style={{ padding: '5px 10px', borderBottom: '1px solid #E2EBF3' }}>{d}</td>
                  <td style={{ padding: '5px 10px', borderBottom: '1px solid #E2EBF3' }}>{o}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 7, paddingBottom: 5, borderBottom: '1px solid #E2EBF3' }}>2. Legal Entities</h3>
        <SkelLines n={2} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 7, paddingBottom: 5, borderBottom: '1px solid #E2EBF3' }}>3. Liability &amp; Bonding</h3>
        <SkelLines n={3} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 7, paddingBottom: 5, borderBottom: '1px solid #E2EBF3' }}>5. Technical Specifications</h3>
        <SkelLines n={2} />
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Turbine Ratings</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={{ textAlign: 'left', padding: '5px 10px', borderBottom: '1px solid #E2EBF3', fontWeight: 600 }}>Parameter</th>
                <th style={{ textAlign: 'left', padding: '5px 10px', borderBottom: '1px solid #E2EBF3', fontWeight: 600 }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {turbines.map(([p, v]) => (
                <tr key={p} className="hover-row">
                  <td style={{ padding: '5px 10px', borderBottom: '1px solid #E2EBF3' }}>{p}</td>
                  <td style={{ padding: '5px 10px', borderBottom: '1px solid #E2EBF3' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ContractPreview() {
  const sections = ['1. Parties', '2. Scope of Work', '3. Payment Terms', '4. Confidentiality'];
  const lineCounts = [3, 4, 2, 2];
  return (
    <>
      <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Draft Contract Agreement</h2>
      {sections.map((t, i) => (
        <div key={t} style={{ marginBottom: 18 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 7, paddingBottom: 5, borderBottom: '1px solid #E2EBF3' }}>{t}</h3>
          <SkelLines n={lineCounts[i]} />
        </div>
      ))}
    </>
  );
}

export default function DocumentsTab({
  previewDoc, showPreview, processing, docExpanded, agents, tasks,
  uploadedFiles, onOpenPrev, onClosePrev, onTogExp, onStartProc, onTogAgent, onTogTask,
  onAddFiles, onRemoveFile,
}) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const rfpActive = previewDoc === 'rfp' && showPreview;
  const contActive = previewDoc === 'contract' && showPreview;
  const rfpExpanded = docExpanded === 'rfp';

  const agentExpanded = rfpExpanded && (
    <div style={{ borderTop: '1px solid #E2EBF3', padding: '10px 12px', display: 'flex', gap: 10 }}>
      {/* A1 */}
      <div style={{ flex: 1, opacity: agents.a1 ? 1 : 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => onTogAgent('a1')}>
          <span className="tick" style={{ background: agents.a1 ? '#13B5CB' : '#CBD5E0', flexShrink: 0 }}>{agents.a1 ? '✓' : ''}</span>
          <span className="ag-badge">A1</span>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Key information and Activities Agent</span>
        </div>
        <div
          style={{ display: 'flex', gap: 6, marginBottom: 7, cursor: 'pointer', ...(agents.a1 ? {} : { pointerEvents: 'none' }) }}
          onClick={() => agents.a1 && onTogTask('tki')}
        >
          <span className="tick" style={{ width: 13, height: 13, fontSize: 8, marginTop: 1, flexShrink: 0, background: tasks.tki && agents.a1 ? '#13B5CB' : '#CBD5E0' }}>
            {tasks.tki && agents.a1 ? '✓' : ''}
          </span>
          <div style={{ opacity: tasks.tki ? 1 : 0.5 }}>
            <div style={{ fontSize: 11, fontWeight: 600 }}>Tender Key Information</div>
            <div style={{ fontSize: 10, color: '#7E95A8', lineHeight: 1.4 }}>Identify key dates, submission requirements, and legal entities.</div>
          </div>
        </div>
        <div
          style={{ display: 'flex', gap: 6, cursor: 'pointer', ...(agents.a1 ? {} : { pointerEvents: 'none' }) }}
          onClick={() => agents.a1 && onTogTask('paa')}
        >
          <span className="tick" style={{ width: 13, height: 13, fontSize: 8, marginTop: 1, flexShrink: 0, background: tasks.paa && agents.a1 ? '#13B5CB' : '#CBD5E0' }}>
            {tasks.paa && agents.a1 ? '✓' : ''}
          </span>
          <div style={{ opacity: tasks.paa ? 1 : 0.5 }}>
            <div style={{ fontSize: 11, fontWeight: 600 }}>Pre-Award Activities</div>
            <div style={{ fontSize: 10, color: '#7E95A8', lineHeight: 1.4 }}>Extract liability clauses, bonding requirements, and NDAs.</div>
          </div>
        </div>
      </div>

      {/* A2 */}
      <div style={{ flex: 1, opacity: agents.a2 ? 1 : 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, cursor: 'pointer' }} onClick={() => onTogAgent('a2')}>
          <span className="tick" style={{ background: agents.a2 ? '#13B5CB' : '#CBD5E0', flexShrink: 0 }}>{agents.a2 ? '✓' : ''}</span>
          <span className="ag-badge">A2</span>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Technical Extraction Agent</span>
        </div>
        <div style={{ fontSize: 11, color: '#7E95A8', fontStyle: 'italic' }}>No tasks configured for this agent.</div>
      </div>

      {/* A3 */}
      <div style={{ flex: 1, opacity: agents.a3 ? 1 : 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, cursor: 'pointer' }} onClick={() => onTogAgent('a3')}>
          <span className="tick" style={{ background: agents.a3 ? '#13B5CB' : '#CBD5E0', flexShrink: 0 }}>{agents.a3 ? '✓' : ''}</span>
          <span className="ag-badge">A3</span>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Risk Analysis Agent</span>
        </div>
        <div style={{ fontSize: 11, color: '#7E95A8', fontStyle: 'italic' }}>No tasks configured for this agent.</div>
      </div>
    </div>
  );

  const processBtn = processing ? (
    <NJButton label="Processing unavailable — agents still running" variant="primary" emphasis="bold" disabled style={{ width: '100%' }} iconName="sync" />
  ) : (
    <NJButton label="✓ Process Documents" variant="primary" emphasis="bold" onClick={onStartProc} style={{ width: '100%' }} />
  );

  const previewPanel = showPreview && previewDoc && (
    <div className="fadein" style={{ flex: 1, minWidth: 0, background: '#fff', border: '1px solid #E2EBF3', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #E2EBF3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#7E95A8', fontWeight: 500 }}>
          {previewDoc === 'rfp' ? 'RFP_Section_A_Technical_Scope.pdf' : 'Draft_Contract_Agreement.docx'}
        </span>
        <NJIconButton icon="close" aria-label="Close preview" scale="sm" onClick={onClosePrev} />
      </div>
      <div style={{ padding: 18, overflowY: 'auto', maxHeight: 'calc(100vh - 230px)' }}>
        {previewDoc === 'rfp' ? <RfpPreview /> : <ContractPreview />}
      </div>
    </div>
  );

  const leftStyle = showPreview && previewDoc ? { flex: '0 0 385px' } : { width: '100%' };

  return (
    <div style={{ display: 'flex', gap: 14, padding: '14px 20px 22px', alignItems: 'flex-start' }}>
      <div style={leftStyle}>
        {/* upload zone */}
        <div
          style={{
            border: `2px dashed ${dragOver ? '#13B5CB' : '#E2EBF3'}`,
            borderRadius: 10, padding: '20px 16px', textAlign: 'center',
            background: dragOver ? '#E8F8FC' : '#fff', marginBottom: 14,
            transition: 'border-color .2s, background .2s',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); onAddFiles(e.dataTransfer.files); }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => { onAddFiles(e.target.files); e.target.value = ''; }}
          />
          <div style={{ fontSize: 24, color: '#13B5CB', marginBottom: 6 }}>⬆</div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Drag and drop tender documents</div>
          <div style={{ fontSize: 12, color: '#7E95A8', marginBottom: 12 }}>Support for PDF and DOCX</div>
          <NJButton
            label="Browse Files"
            variant="secondary"
            emphasis="subtle"
            scale="sm"
            onClick={() => fileInputRef.current?.click()}
          />
        </div>

        {/* uploaded files */}
        {uploadedFiles.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            {uploadedFiles.map((f, i) => (
              <div key={`${f.name}-${i}`} style={{ fontSize: 11, padding: '5px 8px', background: '#F5F8FB', borderRadius: 5, marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>▪ {f.name} <span style={{ color: '#7E95A8' }}>({(f.size / 1024 / 1024).toFixed(1)} MB)</span></span>
                <button onClick={() => onRemoveFile(i)} style={{ background: 'none', border: 'none', color: '#7E95A8', cursor: 'pointer', fontSize: 13, flexShrink: 0 }}>✕</button>
              </div>
            ))}
          </div>
        )}

        {/* list header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Project Documents <span style={{ fontWeight: 400, color: '#7E95A8' }}>({2 + uploadedFiles.length})</span></span>
          <span style={{ fontSize: 10, color: '#7E95A8', fontWeight: 600, letterSpacing: '.05em', cursor: 'pointer' }}>CONFIGURE AGENTS INDIVIDUALLY</span>
        </div>

        {/* doc 1: RFP */}
        <div className={`doc-card ${rfpActive ? 'active-doc' : ''}`}>
          <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#F0F4F8', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15 }}>≡</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>RFP_Section_A_Tec...</div>
              <div style={{ fontSize: 11, color: '#7E95A8' }}>12.4 MB · Uploaded 2h ago</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <NJBadge scale="sm" variant="information">A1</NJBadge><NJBadge scale="sm" variant="information">A2</NJBadge><NJBadge scale="sm" variant="information">A3</NJBadge>
              <button className={`eye-btn ${rfpActive ? 'on' : ''}`} onClick={() => onOpenPrev('rfp')} title="Prévisualiser">
                <span className="eye-ico">👁</span>
              </button>
              <button onClick={() => onTogExp('rfp')} style={{ background: 'none', border: 'none', color: '#7E95A8', fontSize: 13, cursor: 'pointer' }}>
                {rfpExpanded ? '▾' : '▸'}
              </button>
            </div>
          </div>
          {agentExpanded}
        </div>

        {/* doc 2: Contract */}
        <div className={`doc-card ${contActive ? 'active-doc' : ''}`} style={{ marginBottom: 14 }}>
          <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#F0F4F8', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15 }}>≡</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Draft_Contract_Agreement.docx</div>
              <div style={{ fontSize: 11, color: '#7E95A8' }}>2.1 MB · Uploaded 2h ago</div>
            </div>
            <button className={`eye-btn ${contActive ? 'on' : ''}`} onClick={() => onOpenPrev('contract')} title="Prévisualiser">
              <span className="eye-ico">👁</span>
            </button>
          </div>
        </div>

        {/* process */}
        {processBtn}
        <div style={{ textAlign: 'center', fontSize: 10, color: '#7E95A8', marginTop: 6 }}>
          RUNS ALL CONFIGURED AGENTS FOR {2 + uploadedFiles.length} DOCUMENTS
        </div>
      </div>

      {/* preview panel */}
      {previewPanel}
    </div>
  );
}
