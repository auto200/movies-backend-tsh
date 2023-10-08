import React from 'react';

import { cn } from '@/utils';

import { Checkbox, CheckedState } from './Checkbox';
import { Label } from './Label';

export type Option = { label: string; value: string };
export type CheckboxSelectListProps = {
  className?: string;
  onChange: (values: string[]) => void;
  options: Option[];
  selected: string[];
};

export const CheckboxSelectList: React.FC<CheckboxSelectListProps> = ({
  className,
  onChange,
  options,
  selected,
}) => {
  const handleChange = (value: string, checkedState: CheckedState) => {
    if (checkedState === true) {
      return onChange([...selected, value]);
    }

    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div className={cn('flex max-h-48 w-40 flex-col overflow-auto py-1', className)}>
      {options.map(({ label, value }) => {
        const isSelected = selected.includes(value);
        return (
          <Label key={value} className={cn('flex gap-1 py-1', isSelected && 'bg-slate-200')}>
            <Checkbox
              checked={isSelected}
              id={value}
              onCheckedChange={(state) => handleChange(value, state)}
            />
            <p>{label}</p>
          </Label>
        );
      })}
    </div>
  );
};
