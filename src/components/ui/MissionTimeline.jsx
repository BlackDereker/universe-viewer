import { useState } from 'react';
import { Rocket, Info, ChevronRight, History } from 'lucide-react';

const MissionItem = ({ mission, isLast }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                position: 'relative',
                paddingLeft: '24px',
                paddingBottom: isLast ? '0' : '20px',
                cursor: 'default'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Vertical Line */}
            {!isLast && (
                <div style={{
                    position: 'absolute',
                    left: '6px',
                    top: '16px',
                    bottom: '0',
                    width: '2px',
                    background: 'linear-gradient(to bottom, rgba(56, 189, 248, 0.4), transparent)',
                    borderRadius: '1px'
                }} />
            )}

            {/* Node Dot */}
            <div style={{
                position: 'absolute',
                left: '0',
                top: '4px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: isHovered ? '#38bdf8' : 'rgba(56, 189, 248, 0.3)',
                border: '2px solid rgba(0,0,0,0.4)',
                boxShadow: isHovered ? '0 0 10px rgba(56, 189, 248, 0.8)' : 'none',
                transition: 'all 0.3s ease',
                zIndex: 1
            }} />

            {/* Mission Content Card */}
            <div style={{
                background: isHovered ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isHovered ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                borderRadius: '12px',
                padding: '10px 14px',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: '600', fontSize: '12px', color: 'white' }}>{mission.name}</div>
                    <div style={{ fontSize: '10px', color: '#38bdf8', opacity: 0.8 }}>{mission.year}</div>
                </div>

                <div style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <Rocket size={10} />
                    {mission.type}
                </div>

                {isHovered && (
                    <div style={{
                        marginTop: '8px',
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: '1.5',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        paddingTop: '8px',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <Info size={12} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
                            <span>{mission.finding}</span>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

const MissionTimeline = ({ missions }) => {
    if (!missions || missions.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>
                <History size={24} style={{ marginBottom: '8px', opacity: 0.2 }} />
                <div>No exploration data available yet.</div>
            </div>
        );
    }

    // Sort missions by year
    const sortedMissions = [...missions].sort((a, b) => a.year - b.year);

    return (
        <div style={{ marginTop: '10px' }}>
            {sortedMissions.map((mission, index) => (
                <MissionItem
                    key={index}
                    mission={mission}
                    isLast={index === sortedMissions.length - 1}
                />
            ))}
        </div>
    );
};

export default MissionTimeline;
