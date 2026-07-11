import { useState } from 'react';

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (key: string) => void;
  className?: string;
}

/**
 * Horizontal tab bar. Supports both controlled (activeTab + onChange)
 * and uncontrolled (internal state) modes.
 */
export default function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.key ?? '');
  const currentTab = activeTab ?? internalActive;

  const handleChange = (key: string) => {
    setInternalActive(key);
    onChange?.(key);
  };

  return (
    <div className={['flex border-b border-gray-200', className].filter(Boolean).join(' ')}>
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => handleChange(key)}
          className={[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            currentTab === key
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
