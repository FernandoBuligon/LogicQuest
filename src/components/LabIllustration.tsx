export default function LabIllustration() {
  return <div className="lab-illustration" aria-hidden="true">
    <div className="lab-visual-heading"><span className="live-dot" />Bancada de experimentos<span>01 / 06</span></div>
    <svg viewBox="0 0 640 330" fill="none">
      <defs><pattern id="circuit-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1" fill="#40536b" /></pattern></defs>
      <rect width="640" height="330" fill="url(#circuit-grid)" />
      <g stroke="#61758d" strokeWidth="3"><path d="M115 104H170V140H230" /><path d="M350 165H390V145H420" /></g>
      <g stroke="#6ee7b7" strokeWidth="3"><path d="M115 234H185V190H230" /><path d="M185 234V270H390V195H420" /><path d="M500 165H550" /></g>
      <g fill="#16263a" stroke="#465a72"><rect x="45" y="79" width="70" height="50" rx="10" /><rect x="45" y="209" width="70" height="50" rx="10" /><rect x="230" y="115" width="120" height="100" rx="16" /><rect x="420" y="115" width="80" height="100" rx="16" /><rect x="550" y="140" width="60" height="50" rx="10" /></g>
      <g fill="#e5eef8" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="20"><text x="80" y="111">A · 0</text><text x="80" y="241">B · 1</text><text x="290" y="158">AND</text><text x="460" y="158">OR</text></g>
      <g fill="#a9bacd" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="16"><text x="290" y="187">0</text><text x="460" y="187" fill="#6ee7b7">1</text><text x="580" y="172" fill="#6ee7b7">1</text></g>
      <g fill="#67e8f9" stroke="#0b1420" strokeWidth="3">{[[230, 140], [230, 190], [350, 165], [420, 145], [420, 195], [500, 165]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" />)}</g>
    </svg>
    <div className="lab-visual-footer"><span>ENTRADAS → PORTAS → SAÍDA</span><span className="live-dot" />Simulação de sinais</div>
  </div>
}
