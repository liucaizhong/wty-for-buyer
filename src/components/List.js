import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from './CustomIcon'

class Item extends Component {
  static props = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    thumb: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
    ]),
    extra: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
    ]),
    arrow: PropTypes.oneOf(['up', 'down', 'right']),
    wrap: PropTypes.bool,
    align: PropTypes.oneOf(['top', 'center', 'bottom']),
  }

  renderThumb = thumb => thumb ? (
    <div className="list-item__thumb">
      { typeof thumb === 'string'
        ? <img src={thumb} alt="thumb" />
        : thumb
      }
    </div>
  ) : null

  renderContent = (content, wrap) => content ? (
    <div className={`list-item__content ${wrap}`.trim()}>
      { content }
    </div>
  ) : null

  renderExtra = extra => extra ? (
    <div className="list-item__extra">
      { extra }
    </div>
  ) : null

  renderArrow = arrow => {
    let temp = arrow === true ? 'right' : arrow

    if (temp) {
      temp = temp[0].toUpperCase() + temp.slice(1)
    }

    return temp ? (
      <div className="list-item__arrow">
        <Icon
          className="btn"
          role="button"
          iconName={`Chevron${temp}`}
          style={{
            fontSize: '.3rem',
            color: '#888',
            lineHeight: '1.5',
          }}
        />
      </div>
    ) : null
  }

  determineAlign = align => {
    return align || 'center'
  }

  determineWrap = wrap => wrap && 'wrap' || ''

  itemDown = e => {
    this.el.className += ' active'
  }

  itemUp = e => {
    this.el.className = this.el.className.replace('active', '').trim()
  }

  componentDidMount() {
    if (this.props.onClick) {
      this.el.addEventListener('mousedown', this.itemDown)
      this.el.addEventListener('mouseup', this.itemUp)
      this.el.addEventListener('touchstart', this.itemDown)
      this.el.addEventListener('touchend', this.itemUp)
    }
  }

  render () {
    const {
      className,
      style,
      onClick,
      thumb,
      children,
      extra,
      arrow,
      align,
      wrap,
    } = this.props

    return (
      <div
        ref={el => this.el = el}
        className={`list-item ${className || ''}`.trim()}
        style={{...style}}
        onClick={onClick}
      >
        { this.renderThumb(thumb) }
        <div className={`list-item__line ${this.determineAlign(align)}`.trim()}>
          { this.renderContent(children, this.determineWrap(wrap)) }
          { this.renderExtra(extra) }
          { this.renderArrow(arrow) }
        </div>
      </div>
    )
  }
}

export default class List extends Component {
  static props = {
    className: PropTypes.string,
    style: PropTypes.object,
    header: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
    ]),
    footer: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
    ]),
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
    ]),
  }

  static Item = Item

  render () {
    const { children, className, style, header, footer } = this.props

    return (
      <div
        className={`list ${className || ''}`.trim()}
        style={{...style}}
      >
        { header
          ? <div className="list-header">
            { header }
          </div>
          : null
        }
        <div className="list-body">
          { children }
        </div>
        { footer
          ? <div className="list-footer">
            { footer }
          </div>
          : null
        }
      </div>
    )
  }
}