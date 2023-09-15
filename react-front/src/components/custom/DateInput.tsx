import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  const selectedDate = value ? new Date(value) : null;
  const formattedValue = value ? new Date(value).toLocaleDateString() : '';

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date: Date) => onChange(date ? date.toISOString() : '')}
      dateFormat="dd/MM/yyyy"
      className="form-control"
      placeholderText="Selecione a data"
      isClearable
      value={formattedValue}
      minDate={new Date()}
    />
  );
};

export default DateInput;
