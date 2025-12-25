import { Check, AlertTriangle, X } from 'lucide-react';

export default function AnalysisBreakdown({ analysis }) {
    if (!analysis) return null;

    const { domain_age_days, has_https, suspicious_keywords, suspicious_tld, tld } = analysis;

    const Item = ({ label, value, isSafe, detail }) => (
        <div className="roadmap-item" style={{ marginBottom: '0.75rem', padding: '1rem' }}>
            <div className={`roadmap-icon-wrapper ${isSafe ? 'status-safe' : 'status-critical'}`}
                style={{ background: isSafe ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                {isSafe ?
                    <Check size={20} className="status-safe" /> :
                    <AlertTriangle size={20} className="status-critical" />
                }
            </div>
            <div className="w-full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong className="text-secondary" style={{ fontSize: '0.9rem' }}>{label}</strong>
                    <span className={isSafe ? "status-safe" : "status-critical"} style={{ fontWeight: 600 }}>
                        {value}
                    </span>
                </div>
                {detail && <div className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>{detail}</div>}
            </div>
        </div>
    );

    return (
        <div className="card">
            <h3 className="mb-4">Static Analysis Breakdown</h3>

            <Item
                label="HTTPS Encryption"
                value={has_https ? "Enabled" : "Missing"}
                isSafe={has_https}
            />

            <Item
                label="Domain Age"
                value={domain_age_days !== null ? `${domain_age_days} days` : "Unknown"}
                isSafe={domain_age_days > 30}
                detail={domain_age_days < 30 ? "Extremely new domains are suspicious" : "Established domain"}
            />

            <Item
                label="URL Keywords"
                value={suspicious_keywords.length > 0 ? "Suspicious" : "Clean"}
                isSafe={suspicious_keywords.length === 0}
                detail={suspicious_keywords.length > 0 ? `Found: ${suspicious_keywords.join(', ')}` : "No phasing keywords found"}
            />

            <Item
                label="Top-Level Domain (TLD)"
                value={tld}
                isSafe={!suspicious_tld}
                detail={suspicious_tld ? "This TLD is often used for spam" : "Standard TLD"}
            />
        </div>
    );
}
