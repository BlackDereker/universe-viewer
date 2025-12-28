import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSpectralType } from '../../data/starTypes';
import { translateName } from '../../utils/translateNames';

const SystemHeader = ({
    currentSystem,
    isFavorite,
    onToggleFavorite
}) => {
    const { t } = useTranslation();

    if (!currentSystem) return null;

    const spectralType = getSpectralType(currentSystem.star?.temperature);

    // Get translated star type description
    const getStarDescription = (type) => {
        const typeKey = type.name.charAt(0).toLowerCase() + 'Type';
        return t(`stars.${typeKey}`);
    };

    // Get translated star type name for badge
    const getStarTypeName = (type) => {
        const typeKey = type.name.charAt(0).toLowerCase() + 'TypeName';
        return t(`stars.${typeKey}`);
    };

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
                flexShrink: 0
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
                        {translateName(currentSystem.name)}
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
                        {getStarTypeName(spectralType)}
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
                    {getStarDescription(spectralType)}
                    {' • '}
                    {t('header.planets', { count: currentSystem.planets?.length || 0 })}
                    {currentSystem.star?.temperature && ` • ${Math.round(currentSystem.star.temperature)}K`}
                </p>
            </div>

            {/* Favorite button */}
            <button
                onClick={onToggleFavorite}
                title={isFavorite ? t('discovery.removeFavorite') : t('discovery.addFavorite')}
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
