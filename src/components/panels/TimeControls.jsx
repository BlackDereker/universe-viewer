import { Play, Pause, Rewind, FastForward, SkipBack, SkipForward, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import IconButton from '../ui/IconButton';

const TimeControls = ({
    isPaused,
    setIsPaused,
    timeDirection,
    setTimeDirection,
    timeSpeed,
    setTimeSpeed,
    setStepFrame
}) => {
    const { t } = useTranslation();

    return (
        <div
            className="glass-morphism"
            style={{
                padding: '12px 20px',
                borderRadius: '16px',
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}
        >
            {/* Playback Controls */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <IconButton
                    icon={Rewind}
                    onClick={() => { setTimeDirection(-1); setIsPaused(false); }}
                    active={timeDirection === -1 && !isPaused}
                    activeColor="var(--accent-purple)"
                    title={t('time.reverse')}
                    size={32}
                />

                <IconButton
                    icon={SkipBack}
                    onClick={() => { setTimeDirection(-1); setStepFrame(prev => prev + 1); }}
                    title={t('time.step')}
                    size={32}
                />

                <IconButton
                    icon={isPaused ? Play : Pause}
                    onClick={() => {
                        if (isPaused) {
                            setIsPaused(false);
                            setTimeDirection(1);
                        } else {
                            setIsPaused(true);
                        }
                    }}
                    active={!isPaused}
                    activeColor="var(--accent-blue)"
                    title={isPaused ? t('time.play') : t('time.pause')}
                    size={40}
                />

                <IconButton
                    icon={SkipForward}
                    onClick={() => { setTimeDirection(1); setStepFrame(prev => prev + 1); }}
                    title={t('time.step')}
                    size={32}
                />

                <IconButton
                    icon={FastForward}
                    onClick={() => { setTimeDirection(1); setIsPaused(false); }}
                    active={timeDirection === 1 && !isPaused}
                    activeColor="var(--accent-blue)"
                    title={t('time.forward')}
                    size={32}
                />
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

            {/* Speed Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={timeSpeed}
                    onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
                    style={{
                        width: '80px',
                        accentColor: 'var(--accent-blue)',
                        cursor: 'pointer'
                    }}
                />
                <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'var(--accent-blue)',
                    minWidth: '35px'
                }}>
                    {timeSpeed}×
                </span>
            </div>

            {/* Speed Presets */}
            <div style={{ display: 'flex', gap: '4px' }}>
                {[0.5, 1, 2, 5, 10].map(speed => (
                    <button
                        key={speed}
                        onClick={() => setTimeSpeed(speed)}
                        style={{
                            padding: '4px 8px',
                            fontSize: '10px',
                            fontWeight: '700',
                            background: timeSpeed === speed ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        {speed}×
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TimeControls;
