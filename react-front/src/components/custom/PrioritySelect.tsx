import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import priority from '../../context/PriorityContext';

interface Option {
  value: number;
  label: string;
}

interface PrioritySelectProps {
  selected?: number;
  onChange?: (value: number) => void;
}

const PrioritySelect: React.FC<PrioritySelectProps> = ({ selected, onChange }) => {


  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  useEffect(() => {
    setOptions([
      {
        value: 0,
        label: 'Baixa',
      },
      {
        value: 1,
        label: 'Média',
      },
      {
        value: 2,
        label: 'Urgente',
      },
      {
        value: 3,
        label: 'Extremamente urgente',
      },
    ]);

    if (selected !== undefined && selected in priority) {
      setSelectedOption({
        value: selected,
        label: priority[selected],
      });
    }
  }, [selected]);


  const handleSelectChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);

    if(onChange !== undefined) {
        selectedOption ? onChange(selectedOption.value) : onChange(0);
    }
    
  };

  return (
    <div>
      <h2>Selecione a prioridade:</h2>
      <Select
        options={options}
        value={selectedOption}
        onChange={handleSelectChange}
        isSearchable={true}
        placeholder="Pesquisar..."
      />

    </div>
  );
};

export default PrioritySelect;
