import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { User } from '../../utils/GetUser';
import api from '../../api';

interface Option {
  value: number;
  label: string;
}

interface SelectProps<T> {
  apiUrl: string;
  name: string;
  attributeLabel: keyof T;
  onChange?: (value: number) => void;
  selected?: number;
}

const ProjectSelect: React.FC<SelectProps<User>> = ({ apiUrl, name, attributeLabel, onChange, selected }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        api(apiUrl)
        .then((rp) => {
          const optionData = rp.data.map((user: User) => ({
            value: user.id.toString(),
            label: user[attributeLabel] as string,
          }));
          setOptions(optionData);
          setUsers(rp.data)
        })
        .catch((error) => {
          console.error('Erro ao buscar opções:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && selected !== undefined && selected !== 0) {
      const staff = getStaff(selected);
      if (staff) {
        setSelectedOption({
          value: staff.id,
          label: staff[attributeLabel] as string,
        });
      }
    }
  }, [selected, attributeLabel, isLoading]);

  const handleSelectChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);

    if (onChange !== undefined) {
      selectedOption ? onChange(selectedOption.value) : onChange(0);
    }
  };

  const getStaff = (id: number) => {
    const staff = users.find(user => user.id === id);
    return staff;
  };

  return (
    <div>
      <h2>{name}</h2>
      <Select
        options={options}
        value={selectedOption}
        onChange={handleSelectChange}
        isSearchable={true}
        placeholder="Pesquisar..."
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectSelect;
