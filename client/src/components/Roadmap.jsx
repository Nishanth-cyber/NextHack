import { CheckCircle2, CircleDashed, Bot } from 'lucide-react';

export default function Roadmap() {
    return (
        <div className="card">
            <h2 className="mb-4">System Roadmap</h2>

            <div className="roadmap-item active">
                <div className="roadmap-icon-wrapper">
                    <CheckCircle2 size={24} />
                </div>
                <div>
                    <strong>Static Website Analysis</strong>
                    <div className="text-sm text-muted">Whois, TLD, SSL, Keyword checks</div>
                </div>
            </div>

            <div className="roadmap-item" style={{ opacity: 0.7 }}>
                <div className="roadmap-icon-wrapper">
                    <CircleDashed size={24} />
                </div>
                <div>
                    <strong>Dynamic Behavior Analysis</strong>
                    <div className="text-sm text-muted">Playwright execution & screenshot analysis (Planned)</div>
                </div>
            </div>

            <div className="roadmap-item" style={{ opacity: 0.7 }}>
                <div className="roadmap-icon-wrapper">
                    <Bot size={24} />
                </div>
                <div>
                    <strong>AI Agent Detection</strong>
                    <div className="text-sm text-muted">Gemini/LangChain deep content analysis (Planned)</div>
                </div>
            </div>
        </div>
    );
}
