import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

/**
 * Collapsible glass-morphism panel container
 */
const Panel = ({
    title,
    icon: Icon,
    children,
    defaultCollapsed = false,
    className = '',
    style = {},
    collapsible = true
}) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    return (
        <div
            className={`panel glass-morphism ${className}`}
            style={{
                borderRadius: '16px',
                overflow: 'hidden',
                pointerEvents: 'auto',
                ...style
            }}
        >
            {/* Header */}
            <div
                onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
                style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: collapsible ? 'pointer' : 'default',
                    borderBottom: isCollapsed ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.02)',
                    transition: '0.2s'
                }}
            >
                {Icon && <Icon size={16} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />}
                <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    flex: 1
                }}>
                    {title}
                </span>
                {collapsible && (
                    isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />
                )}
            </div>

            {/* Content */}
            <div style={{
                maxHeight: isCollapsed ? '0' : '1000px',
                opacity: isCollapsed ? 0 : 1,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease, opacity 0.2s ease'
            }}>
                <div style={{ padding: '12px 16px' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Panel;
