import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class WhiteSpace extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  }

  render () {
    let { size } = this.props
    size = size === true ? 'md' : size
    return (
      <div className={`white-space white-space-${size}`}></div>
    )
  }
}