import React, { Component } from 'react'
import moment from 'moment'

const calcRatio = ctx => {
  const devicePixelRatio = window.devicePixelRatio || 1
  const backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1

  return devicePixelRatio / backingStoreRatio
}
const interval = 60 * 1000

class TimeLine extends Component {
  draw = () => {
    // get current time
    const curTime = moment().format('HH:mm')
    const [curHour, curMin] = curTime.split`:`
    const unitW = this.el.clientWidth
    const unitH = this.el.clientHeight
    const canvasTop = 1.31 * + curHour + 0.37
    const ctxTop = Math.round((+curMin * unitH / 120) * 100) / 100
    // draw a time benchmark line
    const ctx = this.el.getContext('2d')
    const ratio = calcRatio(ctx)
    this.el.width = unitW * ratio
    this.el.height = unitH * ratio
    this.el.style.top = `${canvasTop}rem`
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, ctxTop * ratio)
    ctx.lineTo(this.el.width * ratio, ctxTop * ratio)
    ctx.stroke()
  }

  componentDidMount() {
    if (!this.drawInterval)
      this.drawInterval = setInterval(this.draw, interval)
    this.draw()
  }

  componentWillUnmount() {
    if (this.drawInterval)
      clearInterval(this.drawInterval)
  }

  render () {
    return (
      <canvas
        ref={el => this.el = el}
        id="time-line"
        style={{
          position: 'absolute',
          width: '100%',
          height: '2.62rem',
          background: 'rgba(255,255,255,0)',
        }}
      ></canvas>
    )
  }
}

class TimeIndex extends Component {
  draw = () => {
    // get current time
    const curTime = moment().format('HH:mm')
    const [curHour, curMin] = curTime.split`:`
    const unitW = this.el.clientWidth
    const unitH = this.el.clientHeight
    const canvasTop = 1.31 * + curHour + 0.2
    const ctxTop = Math.round((+curMin * unitH / 120) * 100) / 100
    // draw a time benchmark line
    const ctx = this.el.getContext('2d')
    const ratio = calcRatio(ctx)
    this.el.width = unitW * ratio
    this.el.height = unitH * ratio
    this.el.style.top = `${canvasTop}rem`
    ctx.fillStyle = 'red'
    ctx.font = `${ 0.2 * ratio}rem Tahoma,Helvetica,Arial,sans-serif`
    if (+curMin > 5 && +curMin + 5 < 60) {
      ctx.fillText(curTime, unitW / 4 * ratio, (ctxTop + 2) * ratio)
    }
  }
  
  componentDidMount() {
    if (!this.drawInterval)
      this.drawInterval = setInterval(this.draw, interval)
    this.draw()
  }

  componentWillUnmount() {
    if (this.drawInterval)
      clearInterval(this.drawInterval)
  }

  render () {
    return (
      <canvas
        ref={el => this.el = el}
        id="time-index"
        style={{
          position: 'absolute',
          width: '100%',
          left: 0,
          height: '2.62rem',
          background: 'rgba(255,255,255,0)',
        }}
      ></canvas>
    )
  }
}


export {
  TimeLine,
  TimeIndex,
}
