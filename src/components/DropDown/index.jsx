import React, { useState } from 'react'
import PropTypes from 'prop-types'

// import s from './DropDown.m.scss'

const DropDown = ({
  label, options, id, setSelectedValue,
}) => (
  <div>
    {label ? <label htmlFor={id}>{label}</label> : null}

    <select id={id} onChange={event => setSelectedValue(event.target.value)}>
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
  setSelectedValue: PropTypes.func.isRequired,
}

export default DropDown

export const useDropDown = ({ label, options, id }) => {
  const [selectedValue, setSelectedValue] = useState(options[0].value)

  return [
    <DropDown label={label} options={options} id={id} setSelectedValue={setSelectedValue} />,
    selectedValue,
  ]
}
