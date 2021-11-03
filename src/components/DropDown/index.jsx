import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// import s from './DropDown.m.scss'

const DropDown = ({
  label, options, id, selectedValue, setSelectedValue,
}) => (
  <div>
    {label ? <label htmlFor={id}>{label}</label> : null}

    <select
      id={id}
      value={selectedValue}
      onChange={event => setSelectedValue(event.target.value)}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

DropDown.defaultProps = {
  label: '',
}

DropDown.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedValue: PropTypes.string.isRequired,
  setSelectedValue: PropTypes.func.isRequired,
}

export default DropDown

export const useDropDown = ({
  label, options, id, initialValue = options[0].value,
}, deps = []) => {
  const [selectedValue, setSelectedValue] = useState(initialValue)

  useEffect(() => setSelectedValue(initialValue), deps)

  return [
    <DropDown
      label={label}
      options={options}
      id={id}
      selectedValue={selectedValue}
      setSelectedValue={setSelectedValue}
    />,
    selectedValue,
  ]
}
