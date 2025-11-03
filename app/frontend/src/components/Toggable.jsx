import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Toggable = forwardRef(({ children, showLabel, hideLabel }, refs) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return { toggleVisibility }
  })

  return visible === false ? (
    <div>
      <button onClick={toggleVisibility}>{showLabel}</button>
    </div>
  ) : (
    <div>
      <button onClick={toggleVisibility}>{hideLabel}</button>
      <div>{children}</div>
    </div>
  )
})

Toggable.displayName = 'Toggable'

Toggable.propTypes = {
  showLabel: PropTypes.string.isRequired,
  hideLabel: PropTypes.string.isRequired,
}

export default Toggable
