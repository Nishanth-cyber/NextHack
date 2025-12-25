export default function ResultCard({ result }) {
    if (!result) return null;

    const { static_risk_score, static_reasons } = result;

    // Design Logic: 100 - risk = protection
    const protection = Math.max(0, 100 - static_risk_score);

    // Status mapping
    // Status mapping
    let statusText = "HIGH SAFETY";
    let statusClass = "status-safe";
    let statusColor = "#10b981";

    if (protection < 50) {
        statusText = "HIGH RISK";
        statusClass = "status-critical";
        statusColor = "#ef4444";
    } else if (protection < 80) {
        statusText = "MODERATE RISK";
        statusClass = "status-moderate";
        statusColor = "#f59e0b";
    } else if (protection < 90) {
        statusText = "LOW RISK";
        statusClass = "status-safe"; // Re-using safe color but maybe different shade?
        statusColor = "#10b981";
    }

    // Needle Rotations: -90 (left) to 90 (right).
    const needleRotation = -90 + (protection / 100) * 180;

    return (
        <div className="animate-enter">

            {/* ACCELERATOR / SPEEDOMETER SECTION */}
            <div className="gauge-wrapper">
                <svg viewBox="0 0 300 160" className="w-[360px]" style={{ width: '100%', maxWidth: '360px' }}>
                    <defs>
                        <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>

                        <filter id="softGlow">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Semicircle Arc */}
                    <path
                        d="M30 140 A120 120 0 0 1 270 140"
                        fill="none"
                        stroke="url(#riskGradient)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        filter="url(#softGlow)"
                    />

                    {/* Animated Needle */}
                    <g
                        className="gauge-needle"
                        style={{
                            transform: `rotate(${needleRotation}deg)`,
                            transformOrigin: "150px 140px"
                        }}
                    >
                        {/* Needle Line */}
                        <line
                            x1="150" y1="140"
                            x2="150" y2="45"
                            stroke={statusColor}
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        {/* Pivot Point */}
                        <circle cx="150" cy="140" r="6" fill={statusColor} />
                    </g>
                </svg>

                {/* Center HUD - Moved down to avoid overlap */}
                <div className="gauge-center" style={{ top: '35%' }}>
                    <div className="gauge-score" style={{ fontSize: '3.5rem', lineHeight: '1' }}>
                        {protection}%
                    </div>
                </div>
                <div className={`gauge-status ${statusClass}`} style={{ position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)' }}>
                    {statusText}
                </div>
            </div>

            <div className="text-center mb-8" style={{ marginTop: '4rem' }}>
                <p className="text-muted text-sm max-w-md mx-auto" style={{ opacity: 0.7 }}>
                    Score is based on static analysis and does not guarantee complete safety.
                </p>
            </div>




        </div>
    );
}
