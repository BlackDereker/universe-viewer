/**
 * Reusable toggle switch with label and description
 */
const Toggle = ({
    label,
    description,
    value,
    onChange,
    color = 'var(--accent-blue)',
    size = 'normal' // 'normal' | 'compact'
}) => {
    const isCompact = size === 'compact';

    return (
        <div style={{ marginBottom: isCompact ? '8px' : '12px' }}>
            <button
                onClick={() => onChange(!value)}
                style={{
                    width: '100%',
                    padding: isCompact ? '8px 10px' : '10px 12px',
                    background: value ? `${color}22` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${value ? color : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: '0.2s'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = value ? `${color}33` : 'rgba(255,255,255,0.06)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = value ? `${color}22` : 'rgba(255,255,255,0.03)';
                }}
            >
                {/* Toggle Switch */}
                <div style={{
                    width: isCompact ? '32px' : '36px',
                    height: isCompact ? '16px' : '18px',
                    background: value ? color : 'rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    position: 'relative',
                    transition: '0.2s',
                    flexShrink: 0
                }}>
                    <div style={{
                        width: isCompact ? '12px' : '14px',
                        height: isCompact ? '12px' : '14px',
                        background: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: value ? (isCompact ? '18px' : '20px') : '2px',
                        transition: '0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }} />
                </div>

                {/* Label */}
                <span style={{
                    fontSize: isCompact ? '12px' : '13px',
                    fontWeight: '500',
                    flex: 1,
                    textAlign: 'left'
                }}>
                    {label}
                </span>
            </button>

            {/* Description */}
            {description && !isCompact && (
                <p style={{
                    fontSize: '10px',
                    color: 'var(--text-secondary)',
                    marginTop: '6px',
                    marginLeft: '2px',
                    fontStyle: 'italic'
                }}>
                    {description}
                </p>
            )}
        </div>
    );
};

export default Toggle;
