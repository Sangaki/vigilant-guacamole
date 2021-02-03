import { DropdownOption } from '../types/DropdownOptions';

export enum Priority {
  'Neutral priority',
  'Normal priority',
  'Important priority',
  'Urgently priority',
}

export const DropdownPriorities: DropdownOption[] = Object
  .values(Priority)
  .slice(0, Object.keys(Priority).length / 2)
  .map((o, index) => {
    return {
      label: o.toString(),
      value: index,
    };
  });