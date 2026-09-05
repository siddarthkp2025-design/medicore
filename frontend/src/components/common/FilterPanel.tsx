import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  placeholder: string;
  options: FilterOption[];
}

interface FilterPanelProps {
  filters: FilterConfig[];
  onFilterChange: (key: string, value: string) => void;
  className?: string;
}

export function FilterPanel({ filters, onFilterChange, className }: FilterPanelProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className || ''}`}>
      {filters.map((filter) => (
        <Select key={filter.key} onValueChange={(val) => onFilterChange(filter.key, val === 'all' ? '' : val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {filter.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
