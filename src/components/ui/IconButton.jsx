/**
 * Consistent icon button for actions
 */
const IconButton = ({
    icon: Icon,
    onClick,
    title,
    active = false,
    activeColor = 'var(--accent-blue)',
    size = 36,
    disabled = false
}) => {
    return (
        <button
            onClick={onClick}
            title={title}
            disabled={disabled}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                background: active ? activeColor : 'rgba(255,255,255,0.08)',
                border: `1px solid ${active ? activeColor : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '8px',
                color: 'white',
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: '0.2s',
                opacity: disabled ? 0.5 : 1
            }}
            onMouseOver={(e) => {
                if (!disabled) {
                    e.currentTarget.style.background = active ? activeColor : 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.background = active ? activeColor : 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            <Icon size={size * 0.44} />
        </button>
    );
};

export default IconButton;
