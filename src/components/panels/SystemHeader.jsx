import { Heart, Sun } from 'lucide-react';
import { getSpectralType } from '../../data/starTypes';

const SystemHeader = ({
    currentSystem,
    isFavorite,
    onToggleFavorite
}) => {
    if (!currentSystem) return null;

    const spectralType = getSpectralType(currentSystem.star?.temperature);

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
                maxWidth: '600px'
            }}
        >
            {/* Star indicator with pulse animation for active stars */}
            <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${spectralType.color} 0%, ${currentSystem.star?.color || spectralType.color} 70%)`,
                boxShadow: `0 0 20px ${spectralType.color}, 0 0 40px ${spectralType.color}40`,
                flexShrink: 0,
                animation: spectralType.surfaceActivity > 0.7 ? 'pulse 2s ease-in-out infinite' : 'none'
            }} />

            {/* System info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                    <h2 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #fff, var(--accent-blue))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {currentSystem.name}
                    </h2>
                    {/* Star type badge */}
                    <span style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: `${spectralType.color}20`,
                        color: spectralType.color,
                        border: `1px solid ${spectralType.color}40`,
                        whiteSpace: 'nowrap'
                    }}>
                        {spectralType.name}
                    </span>
                </div>
                <p style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.4',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {spectralType.description}
                    {' • '}
                    {currentSystem.planets?.length} planet{currentSystem.planets?.length !== 1 ? 's' : ''}
                    {currentSystem.star?.temperature && ` • ${Math.round(currentSystem.star.temperature)}K`}
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

            {/* Pulse animation for active stars */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.15); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

export default SystemHeader;
