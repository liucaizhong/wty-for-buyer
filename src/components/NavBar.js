import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Icon from './CustomIcon'

class NavBar extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    leftContent: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
    ]),
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
    ]),
    rightContent: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
    ]),
    defaultLeft: PropTypes.bool,
  }

  render () {
    const { leftContent, children, rightContent, history, className, style, defaultLeft } = this.props

    return (
      <div className={`navbar ${className || ''}`.trim()} style={{...style}}>
        <div className="navbar__left">
          { leftContent || defaultLeft ? (
            <Icon
              className="btn"
              role="button"
              iconName="ChevronLeft"
              onClick={e => {
                e.preventDefault()
                history.goBack()
              }}
            />
          ) : null }
        </div>
        <div className="navbar__title">
          { children }
        </div>
        <div className="navbar__right">
          { rightContent }
        </div>
      </div>
    )
  }
}

export default withRouter(NavBar)
