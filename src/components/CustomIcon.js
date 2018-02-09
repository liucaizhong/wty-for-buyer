import React from 'react'
import { Icon } from 'office-ui-fabric-react/lib/Icon'

const CustomIcon = ({
  type,
  ...restProps
}) => {
  return typeof type !== 'undefined' ? (
    <svg {...restProps}>
      {/* svg-sprite-loader@0.3.x */}
      {/* <use xlinkHref={type} */}
      {/* svg-sprite-loader@latest */}
      <use xlinkHref={`#${type.default.id}`} />
    </svg>
  )
    : <Icon {...restProps}/>
}

export default CustomIcon
