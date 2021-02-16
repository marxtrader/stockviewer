import React from 'react';
//import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import "./TransactionDataForm.css"

export default function DatePicker(props) {

  return (
    <div className="datepicker">
      <label>Date</label>
      <DayPickerInput onDayChange={props.handleDateChange} />
    </div>
  );
}