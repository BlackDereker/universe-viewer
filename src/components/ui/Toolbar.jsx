import { Search, Settings, Globe2, Map, Home } from 'lucide-react';

const Toolbar = ({
    activePanel,
    setActivePanel,
    onOpenGalacticMap,
    currentSystemName,
    onGoHome
}) => {
    const buttons = [
        { id: 'discovery', icon: Search, label: 'Discovery', color: '#38bdf8' },
        { id: 'display', icon: Settings, label: 'Display', color: '#a855f7' },
        { id: 'planets', icon: Globe2, label: 'Planets', color: '#22c55e' },
    ];

    const handleClick = (id) => {
        setActivePanel(activePanel === id ? null : id);
    };

    const isNotSolarSystem = currentSystemName && currentSystemName !== 'Solar System';

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'auto'
        }}>
            {/* Home button - only visible when not in Solar System */}
            {isNotSolarSystem && (
                <button
                    onClick={onGoHome}
                    title="Return to Solar System"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.15))',
                        border: '1px solid rgba(251, 191, 36, 0.4)',
                        borderRadius: '10px',
                        color: '#fbbf24',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.2s ease',
                        marginRight: '4px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251, 191, 36, 0.35), rgba(245, 158, 11, 0.25))';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.15))';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <Home size={18} />
                </button>
            )}

            {buttons.map(btn => {
                const Icon = btn.icon;
                const isActive = activePanel === btn.id;
                return (
                    <button
                        key={btn.id}
                        onClick={() => handleClick(btn.id)}
                        title={btn.label}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            background: isActive
                                ? `linear-gradient(135deg, ${btn.color}33, ${btn.color}22)`
                                : 'rgba(0, 0, 0, 0.5)',
                            border: `1px solid ${isActive ? btn.color : 'rgba(255,255,255,0.15)'}`,
                            borderRadius: '10px',
                            color: isActive ? btn.color : 'rgba(255,255,255,0.7)',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.2s ease',
                            boxShadow: isActive ? `0 0 20px ${btn.color}33` : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                            }
                        }}
                    >
                        <Icon size={18} />
                    </button>
                );
            })}

            {/* Galaxy Map - separate action */}
            <button
                onClick={onOpenGalacticMap}
                title="Galaxy Map"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease',
                    marginLeft: '4px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(16, 185, 129, 0.25))';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
            >
                <Map size={18} />
            </button>
        </div>
    );
};

export default Toolbar;

