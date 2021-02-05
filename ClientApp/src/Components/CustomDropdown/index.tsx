import React, { useCallback, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { DropdownOption } from 'src/shared/types/DropdownOptions';

interface Props {
  options: DropdownOption[],
  onSelect?: (value: string) => void,
  selectedOption?: string,
}

export const CustomDropdown: React.FC<Props> = (props) => {
  const { options, onSelect, selectedOption } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] =
    useState<string | number | null>(options[0] ? options[0].value : null);

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const onOptionChange = useCallback((option) => {
    setSelectedValue(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  }, [setSelectedValue, setIsOpen, onSelect]);

  return (
    <Dropdown isOpen={isOpen} toggle={toggleOpen}>
      <DropdownToggle onClick={toggleOpen}>
        {options.find(o => o.value.toString() === selectedOption)?.label
        || options.find(o => o.value.toString() === selectedValue?.toString())?.label}
      </DropdownToggle>
      <DropdownMenu>
        {options.map(o => {
          return (
            <DropdownItem
              key={o.value}
              onClick={() => {
                onOptionChange(o.value);
              }}
            >
              {o.label}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};