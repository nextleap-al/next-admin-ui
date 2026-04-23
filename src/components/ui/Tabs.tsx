import { ReactNode, createContext, useContext, useState } from 'react';
import { cn } from '@/utils/cn';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

const Tabs = ({ defaultValue, value, onChange, children, className }: TabsProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value ?? internalValue;

  const setActiveTab = (tab: string) => {
    if (!value) {
      setInternalValue(tab);
    }
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabListProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

const TabList = ({ children, className, variant = 'default' }: TabListProps) => {
  const variants = {
    default:
      'flex gap-1 p-1 rounded-xl bg-[var(--surface-100)] border border-[var(--border-light)]',
    pills: 'flex gap-2',
    underline: 'flex gap-4 border-b border-[var(--border-light)]',
  };

  // Drag-to-scroll support for overflow
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const startX = e.pageX - el.offsetLeft;
    const scrollLeft = el.scrollLeft;
    let dragging = true;

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging) return;
      ev.preventDefault();
      const x = ev.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX);
    };
    const onMouseUp = () => {
      dragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      el.style.cursor = 'grab';
      el.style.removeProperty('user-select');
    };
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      className={cn(variants[variant], 'overflow-x-auto scrollbar-hide cursor-grab', className)}
      role="tablist"
      onMouseDown={handleMouseDown}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {children}
    </div>
  );
};

export interface TabTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

const TabTrigger = ({ value, children, className, disabled, icon }: TabTriggerProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabTrigger must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-2 whitespace-nowrap flex-shrink-0',
        isActive
          ? 'bg-gold-400/15 text-gold-500 border border-gold-400/30 shadow-sm'
          : 'bg-gold-400/5 text-[var(--text-secondary)] hover:text-gold-500 hover:bg-gold-400/10',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {icon}
      {children}
    </button>
  );
};

export interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const TabContent = ({ value, children, className }: TabContentProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabContent must be used within Tabs');

  const { activeTab } = context;

  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn('animate-fade-in', className)}
    >
      {children}
    </div>
  );
};

export { Tabs, TabList, TabTrigger, TabContent };
