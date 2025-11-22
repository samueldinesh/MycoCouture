import React from 'react';
import { CustomizationState, DressType, MaterialColor, AccessoryType } from '../types';
import { DRESS_OPTIONS, COLOR_OPTIONS, ACCESSORY_OPTIONS } from '../constants';
import { CheckIcon } from './Icons';

interface ControlPanelProps {
  state: CustomizationState;
  onChange: (newState: Partial<CustomizationState>) => void;
  disabled: boolean;
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-8 last:mb-0">
    <h3 className="text-myco-accent uppercase text-xs font-bold tracking-[0.2em] mb-4 pl-1 border-l-2 border-myco-fungi">
      {title}
    </h3>
    <div className="flex flex-wrap gap-3">
      {children}
    </div>
  </div>
);

interface OptionButtonProps<T extends string> {
  value: T;
  current: T;
  label: string;
  field: keyof CustomizationState;
  onChange: (newState: Partial<CustomizationState>) => void;
  disabled: boolean;
}

const OptionButton = <T extends string>({ 
  value, 
  current, 
  label, 
  field, 
  onChange, 
  disabled 
}: OptionButtonProps<T>) => {
  const isSelected = current === value;
  return (
    <button
      disabled={disabled}
      onClick={() => onChange({ [field]: value } as any)}
      className={`
        relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border
        ${isSelected 
          ? 'bg-myco-leaf/10 border-myco-leaf text-myco-leaf shadow-[0_0_15px_rgba(77,124,15,0.2)]' 
          : 'bg-myco-base border-myco-light text-myco-accent hover:border-stone-500 hover:text-stone-200'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {label}
      {isSelected && (
        <div className="absolute -top-1 -right-1 bg-myco-leaf text-white rounded-full p-0.5">
          <CheckIcon className="w-3 h-3" />
        </div>
      )}
    </button>
  );
};

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange, disabled }) => {
  return (
    <div className="h-full overflow-y-auto p-6 bg-myco-dark/50 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-myco-light/30">
      <div className="mb-8">
        <h2 className="font-serif text-3xl text-stone-100 mb-2">Customize Fit</h2>
        <p className="text-stone-500 text-sm">Select your preferred mycelium blend and cut.</p>
      </div>

      <Section title="Silhouette">
        {DRESS_OPTIONS.map((option) => (
          <OptionButton<DressType>
            key={option}
            value={option}
            current={state.dressType}
            label={option}
            field="dressType"
            onChange={onChange}
            disabled={disabled}
          />
        ))}
      </Section>

      <Section title="Material Tone">
        {COLOR_OPTIONS.map((option) => (
          <OptionButton<MaterialColor>
            key={option}
            value={option}
            current={state.color}
            label={option}
            field="color"
            onChange={onChange}
            disabled={disabled}
          />
        ))}
      </Section>

      <Section title="Accessories">
        {ACCESSORY_OPTIONS.map((option) => (
          <OptionButton<AccessoryType>
            key={option}
            value={option}
            current={state.accessory}
            label={option}
            field="accessory"
            onChange={onChange}
            disabled={disabled}
          />
        ))}
      </Section>
    </div>
  );
};