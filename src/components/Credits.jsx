import { useState } from 'react';

const Credits = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            zIndex: 100,
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px'
        }}>
            {isExpanded ? (
                <div style={{
                    background: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    maxWidth: '300px',
                    color: 'rgba(255, 255, 255, 0.9)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <span style={{ fontWeight: '600', fontSize: '12px' }}>Credits</span>
                        <button
                            onClick={() => setIsExpanded(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255, 255, 255, 0.6)',
                                cursor: 'pointer',
                                fontSize: '16px',
                                padding: '0 4px'
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <div style={{ lineHeight: '1.6' }}>
                        <p style={{ margin: '0 0 8px 0' }}>
                            <strong>Solar System Textures:</strong><br />
                            <a
                                href="https://www.solarsystemscope.com/textures/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#38bdf8', textDecoration: 'none' }}
                            >
                                Solar System Scope
                            </a>
                            <br />
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '10px' }}>
                                CC BY 4.0 License
                            </span>
                        </p>
                        <p style={{ margin: '0 0 8px 0' }}>
                            <strong>Exoplanet Data:</strong><br />
                            <a
                                href="https://exoplanetarchive.ipac.caltech.edu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#38bdf8', textDecoration: 'none' }}
                            >
                                NASA Exoplanet Archive
                            </a>
                        </p>
                        <p style={{ margin: '0', color: 'rgba(255, 255, 255, 0.5)', fontSize: '10px' }}>
                            This project is for educational purposes.
                        </p>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsExpanded(true)}
                    style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        fontSize: '10px',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.5)'}
                >
                    Credits
                </button>
            )}
        </div>
    );
};

export default Credits;
