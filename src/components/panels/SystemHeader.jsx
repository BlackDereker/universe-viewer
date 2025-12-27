import { Heart } from 'lucide-react';

const SystemHeader = ({
    currentSystem,
    isFavorite,
    onToggleFavorite
}) => {
    if (!currentSystem) return null;

    return (
        <div
            className="glass-morphism"
            style={{
                padding: '14px 24px',
                borderRadius: '16px',
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                maxWidth: '550px'
            }}
        >
            {/* Star indicator */}
            <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: currentSystem.star?.color || '#ffdd00',
                boxShadow: `0 0 16px ${currentSystem.star?.color || '#ffdd00'}`,
                flexShrink: 0
            }} />

            {/* System info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '2px',
                    background: 'linear-gradient(135deg, #fff, var(--accent-blue))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {currentSystem.name}
                </h2>
                <p style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.4',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {currentSystem.planets?.length} planet{currentSystem.planets?.length !== 1 ? 's' : ''}
                    {' • '}
                    {currentSystem.discoveryYear === 0 ? 'Ancient' : `Discovered ${currentSystem.discoveryYear}`}
                    {currentSystem.coords?.dist && ` • ${Math.round(currentSystem.coords.dist * 3.26)} ly`}
                </p>
            </div>

            {/* Favorite button */}
            <button
                onClick={onToggleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                style={{
                    width: '32px',
                    height: '32px',
                    background: isFavorite ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isFavorite ? '#ec4899' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px',
                    color: isFavorite ? '#ec4899' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
        </div>
    );
};

export default SystemHeader;
