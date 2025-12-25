import { ShieldAlert } from 'lucide-react';

export default function Header() {
    return (
        <header className="mb-8 text-center">
            <div className="flex-center mb-4">
                <ShieldAlert size={48} className="text-blue-500" style={{ color: '#3b82f6' }} />
            </div>
            <h1 className="text-4xl mb-2 title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                Fake Website Detection
            </h1>
            <p className="text-muted text-lg" style={{ fontSize: '1.125rem' }}>
                Detect suspicious websites before you trust them
            </p>
        </header>
    );
}
