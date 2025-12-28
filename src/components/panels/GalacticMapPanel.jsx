import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search, Map, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { translateName } from '../../utils/translateNames';

const GalacticMapPanel = ({
    onClose,
    searchTerm,
    setSearchTerm,
    currentSystemName,
    systems,
    onSelectSystem
}) => {
    const { t } = useTranslation();
    const [showSearch, setShowSearch] = useState(false);

    // Filter systems based on search term
    const searchResults = useMemo(() => {
        if (!searchTerm || searchTerm.length < 2 || !systems) return [];
        const lowerSearch = searchTerm.toLowerCase();
        return systems
            .filter(s => s.hostname.toLowerCase().includes(lowerSearch))
            .slice(0, 10); // Limit to 10 results
    }, [searchTerm, systems]);

    return (
        <>
            {/* Top bar */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                zIndex: 20,
                pointerEvents: 'none'
            }}>
                {/* Left: Back button - fixed width for centering */}
                <div style={{ flex: '1 1 0', display: 'flex', justifyContent: 'flex-start' }}>
                    <button
                        onClick={onClose}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            color: 'white',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.2s ease',
                            pointerEvents: 'auto'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                    >
                        <ArrowLeft size={16} />
                        {t('galacticMap.returnToSystem', { system: translateName(currentSystemName || 'System') })}
                    </button>
                </div>

                {/* Center: Title */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'white',
                        fontFamily: 'Inter, sans-serif'
                    }}>
                        <Compass size={20} style={{ opacity: 0.7 }} />
                        <span style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            letterSpacing: '2px'
                        }}>
                            {t('galacticMap.title')}
                        </span>
                    </div>
                    <span style={{
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        letterSpacing: '1px'
                    }}>
                        {t('galacticMap.subtitle')}
                    </span>
                </div>

                {/* Right: Search with Dropdown - fixed width for centering */}
                <div style={{ flex: '1 1 0', display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '4px',
                        pointerEvents: 'auto',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {showSearch && (
                                <input
                                    type="text"
                                    placeholder={t('galacticMap.searchSystems')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.6)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '8px',
                                        padding: '10px 14px',
                                        color: 'white',
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '13px',
                                        width: '250px',
                                        outline: 'none',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                />
                            )}
                            <button
                                onClick={() => {
                                    setShowSearch(!showSearch);
                                    if (showSearch) setSearchTerm('');
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: showSearch ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0, 0, 0, 0.6)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Search size={16} />
                            </button>
                        </div>

                        {/* Search Results Dropdown */}
                        {showSearch && searchResults.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '8px',
                                background: 'rgba(0, 0, 0, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                backdropFilter: 'blur(15px)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                                width: '300px',
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}>
                                <div style={{
                                    padding: '8px 12px',
                                    fontSize: '10px',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                    letterSpacing: '1px'
                                }}>
                                    {t('galacticMap.results', { count: searchResults.length })}
                                </div>
                                {searchResults.map((system) => (
                                    <div
                                        key={system.hostname}
                                        onClick={() => {
                                            onSelectSystem(system.hostname);
                                            setSearchTerm('');
                                            setShowSearch(false);
                                        }}
                                        style={{
                                            padding: '12px 14px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                            transition: 'background 0.15s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <span style={{
                                            color: system.starColor,
                                            fontSize: '18px',
                                            textShadow: `0 0 8px ${system.starColor}`
                                        }}>★</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                color: 'white',
                                                fontFamily: 'Inter, sans-serif',
                                                fontSize: '13px',
                                                fontWeight: '500'
                                            }}>
                                                {system.hostname}
                                            </div>
                                            <div style={{
                                                color: 'rgba(255, 255, 255, 0.5)',
                                                fontSize: '10px',
                                                marginTop: '2px'
                                            }}>
                                                {system.starType} • {t('header.planets', { count: system.planetCount })}
                                            </div>
                                        </div>
                                        <div style={{
                                            color: 'rgba(255, 255, 255, 0.4)',
                                            fontSize: '10px'
                                        }}>
                                            {system.distance.toFixed(0)} pc
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No results message */}
                        {showSearch && searchTerm.length >= 2 && searchResults.length === 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '8px',
                                background: 'rgba(0, 0, 0, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '10px',
                                padding: '16px 20px',
                                backdropFilter: 'blur(15px)',
                                width: '250px',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    fontSize: '12px'
                                }}>
                                    {t('galacticMap.noResults', { term: searchTerm })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom instructions */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                lineHeight: '1.6',
                backdropFilter: 'blur(10px)',
                zIndex: 20
            }}>
                <div style={{ marginBottom: '4px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
                    {t('galacticMap.controls')}
                </div>
                <div>🖱️ {t('galacticMap.dragToRotate')}</div>
                <div>👆 {t('galacticMap.clickStar')}</div>
            </div>

            {/* Legend */}
            <div style={{
                position: 'absolute',
                bottom: '130px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                backdropFilter: 'blur(10px)',
                zIndex: 20
            }}>
                <div style={{
                    marginBottom: '8px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: '500',
                    fontSize: '11px'
                }}>
                    {t('galacticMap.starTypes')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {[
                        { color: '#ff4400', key: 'mTypeLabel' },
                        { color: '#ffaa00', key: 'kTypeLabel' },
                        { color: '#ffdd00', key: 'gTypeLabel' },
                        { color: '#ffffcc', key: 'fTypeLabel' },
                        { color: '#aaccff', key: 'abTypeLabel' }
                    ].map(item => (
                        <div key={item.key} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                            <span style={{
                                color: item.color,
                                fontSize: '14px',
                                textShadow: `0 0 6px ${item.color}`
                            }}>●</span>
                            {t(`galacticMap.${item.key}`)}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default GalacticMapPanel;
