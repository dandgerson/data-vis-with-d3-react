/* eslint-disable max-len */
import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import s from './DropDown.m.scss'

const DropDown = ({
  label, options, id, selectedValue, setSelectedValue,
}) => (
  <div className={s.root}>
    {label ? <label htmlFor={id}>{label}</label> : null}

    <select
      id={id}
      value={selectedValue.value}
      onChange={event => setSelectedValue(options.find(option => option.value === event.target.value))}
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
  selectedValue: PropTypes.object.isRequired,
  setSelectedValue: PropTypes.func.isRequired,
}

export default DropDown

export const useDropDown = ({
  label, options, id, initialValue = options[0],
}, deps = []) => {
  const [selectedValue, setSelectedValue] = useState(initialValue)

  useEffect(() => setSelectedValue(initialValue), deps)

  const dropDown = useMemo(
    () => (
      <DropDown
        label={label}
        options={options}
        id={id}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />
    ),
    [label, options, id, initialValue],
  )

  return [dropDown, selectedValue]
}
