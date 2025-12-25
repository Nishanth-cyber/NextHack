import { Search, Loader2 } from 'lucide-react';

export default function UrlInput({ url, setUrl, onSubmit, isLoading }) {
    return (
        <form onSubmit={onSubmit} className="mb-8">
            <div className="input-group">
                <div style={{ position: 'relative', flexGrow: 1 }}>
                    <Search className="input-icon" size={20} />
                    <input
                        type="url"
                        className="input-field"
                        placeholder="Enter website URL (e.g. https://example.com)..."
                        required
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? (
                        <span className="flex-center gap-2">
                            <Loader2 className="animate-spin" size={20} /> Analyzing...
                        </span>
                    ) : (
                        "Analyze Website"
                    )}
                </button>
            </div>
        </form>
    );
}
