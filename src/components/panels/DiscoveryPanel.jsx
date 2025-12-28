import { Search, Sparkles, Loader2, Shuffle, Star, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Panel from '../ui/Panel';
import { searchSystems, getFeaturedSystems, getRandomSystems, getSystemsByStarType, getFavoriteSystems, getFavorites } from '../../services/catalogService';

const starFilters = [
    { key: 'M', label: 'M', color: '#ff4400', tooltip: 'Red Dwarf' },
    { key: 'K', label: 'K', color: '#ffaa00', tooltip: 'Orange' },
    { key: 'G', label: 'G', color: '#ffdd00', tooltip: 'Yellow (Sun-like)' },
    { key: 'F', label: 'F', color: '#ffffcc', tooltip: 'White' },
    { key: 'A', label: 'A', color: '#ccddff', tooltip: 'Blue-White' },
];

const DiscoveryPanel = ({ onSelectSystem, isLoading, setIsLoading }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [browseMode, setBrowseMode] = useState('featured');
    const [hasSearched, setHasSearched] = useState(false);

    // Load browse data
    useEffect(() => {
        const loadBrowseData = async () => {
            if (searchTerm.length > 0) return;
            setIsLoading(true);
            try {
                let results = [];
                if (browseMode === 'featured') {
                    results = await getFeaturedSystems();
                } else if (browseMode === 'random') {
                    results = await getRandomSystems(8);
                } else if (browseMode === 'favorites') {
                    results = await getFavoriteSystems();
                } else if (['M', 'K', 'G', 'F', 'A'].includes(browseMode)) {
                    results = await getSystemsByStarType(browseMode);
                }
                setSearchResults(results);
            } catch (error) {
                console.error('Error loading browse data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadBrowseData();
    }, [browseMode, searchTerm, setIsLoading]);

    // Search logic
    useEffect(() => {
        if (searchTerm.length === 0) {
            setHasSearched(false);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 1) {
                setIsLoading(true);
                setHasSearched(true);
                const results = await searchSystems(searchTerm);
                setSearchResults(results);
                setIsLoading(false);
            }
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, setIsLoading]);

    const handleRandomDiscover = async () => {
        setBrowseMode('random');
        setIsLoading(true);
        const results = await getRandomSystems(8);
        setSearchResults(results);
        setIsLoading(false);
    };

    return (
        <Panel title={t('discovery.title')} icon={Sparkles} style={{ width: '280px' }} collapsible={false}>
            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '10px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder={t('discovery.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '10px 10px 10px 32px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none'
                    }}
                />
                {isLoading && (
                    <Loader2 size={14} className="spinning" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-blue)' }} />
                )}
            </div>

            {/* Filter Tabs */}
            {searchTerm.length === 0 && (
                <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <FilterButton active={browseMode === 'featured'} onClick={() => setBrowseMode('featured')} icon={Star}>{t('discovery.featured')}</FilterButton>
                    <FilterButton active={browseMode === 'favorites'} onClick={() => setBrowseMode('favorites')} icon={Heart} color="#ec4899">{t('discovery.favorites')}</FilterButton>
                    <FilterButton active={browseMode === 'random'} onClick={handleRandomDiscover} icon={Shuffle} color="var(--accent-purple)">{t('discovery.random')}</FilterButton>
                    {starFilters.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setBrowseMode(f.key)}
                            title={f.tooltip}
                            style={{
                                padding: '4px 8px',
                                fontSize: '10px',
                                fontWeight: '700',
                                background: browseMode === f.key ? f.color : 'rgba(255,255,255,0.05)',
                                border: 'none',
                                borderRadius: '4px',
                                color: browseMode === f.key ? '#000' : f.color,
                                cursor: 'pointer'
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Results */}
            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {hasSearched && searchResults.length === 0 && searchTerm.length > 0 && (
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '16px' }}>
                        {t('discovery.noResults', { term: searchTerm })}
                    </p>
                )}
                {browseMode === 'favorites' && searchResults.length === 0 && !hasSearched && (
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '16px' }}>
                        {t('discovery.noFavorites')}
                    </p>
                )}
                {searchResults.map(result => (
                    <button
                        key={result.hostname}
                        onClick={() => {
                            onSelectSystem(result.hostname);
                            setSearchTerm('');
                        }}
                        style={{
                            padding: '8px 10px',
                            textAlign: 'left',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: result.starColor,
                            boxShadow: `0 0 6px ${result.starColor}`,
                            flexShrink: 0
                        }} />
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {result.hostname}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                                {t('header.planets', { count: result.planetCount })} • {result.starType}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </Panel >
    );
};

const FilterButton = ({ children, active, onClick, icon: Icon, color = 'var(--accent-blue)' }) => (
    <button
        onClick={onClick}
        style={{
            padding: '4px 8px',
            fontSize: '10px',
            fontWeight: '600',
            background: active ? color : 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        }}
    >
        {Icon && <Icon size={10} />}
        {children}
    </button>
);

export default DiscoveryPanel;
