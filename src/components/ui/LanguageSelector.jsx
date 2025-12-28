import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { languages } from '../../i18n';

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="glass-morphism"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                    minWidth: '100px'
                }}
            >
                <Globe size={14} />
                <span>{currentLang.flag}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{currentLang.name}</span>
                <ChevronDown size={12} style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s'
                }} />
            </button>

            {isOpen && (
                <div
                    className="glass-morphism"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        zIndex: 1000,
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: '10px 12px',
                                background: lang.code === i18n.language
                                    ? 'rgba(59, 130, 246, 0.3)'
                                    : 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '13px',
                                textAlign: 'left',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (lang.code !== i18n.language) {
                                    e.target.style.background = 'rgba(255,255,255,0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (lang.code !== i18n.language) {
                                    e.target.style.background = 'transparent';
                                }
                            }}
                        >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
