import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import moment from 'moment'
import _ from 'lodash'
import Icon from './CustomIcon'
import { TimeIndex, TimeLine } from './TimeMark'

class ScheduleManagement extends Component {
  constructor(props) {
    super(props)

    // store in redux
    // todo...
    const daysData = [{
      date: '20171105',
      allDayEvents: [{
        isFirst: true,
        // row: 1,
        title: '节日2',
      }],
    }, {
      date: '20171106',
      allDayEvents: [{
        isFirst: false,
        // row: 1,
        title: '节日2',
      }],
    }, {
      date: '20171107',
      allDayEvents: [{
        isFirst: true,
        // row: 0,
        title: '节日1',
      }],
    }, {
      date: '20171108',
      allDayEvents: [{
        isFirst: false,
        // row: 0,
        title: '节日1',
      }, {
        isFirst: true,
        // row: 1,
        title: '节日3',
      }],
      dayEvents: [{
        xPos: 0,
        yPos: 0.32,
        xWidth: 0.3333,
        yHeight: 0.0417,
        title: '调研1',
      }, {
        xPos: 0.3333,
        yPos: 0.32,
        xWidth: 0.3333,
        yHeight: 0.0417,
        title: '调研2',
      }, {
        xPos: 0.6666,
        yPos: 0.34,
        xWidth: 0.3333,
        yHeight: 0.0417,
        title: '调研 航天科技 中国石化',
      }],
    }, {
      date: '20171109',
      allDayEvents: [{
        isFirst: false,
        // row: 0,
        title: '节日1',
      }, {
        isFirst: false,
        // row: 1,
        title: '节日3',
      }, {
        isFirst: true,
        // row: 2,
        title: '节日4',
      }],
    }, {
      date: '20171110',
      allDayEvents: [{
        isFirst: false,
        // row: 2,
        title: '节日4',
      }],
    }, {
      date: '20171111',
      allDayEvents: [{
        isFirst: true,
        // row: 0,
        title: '节日5',
      }],
    }]

    this.today = moment().format('YYYYMMDD')

    this.state = {
      curMonth: moment().month(),
      // daysData: [],
      daysData,
    }
  }

  getDirection = (startX, startY, endX, endY) => {
    // 0: no move,1: left or right, 2: up or down
    const distX = Math.abs(startX - endX)
    const distY = Math.abs(startY - endY)

    if (distX < 2 && distY < 2)
      return 0
    
    if (distX > distY) 
      return 1
    else
      return 2
  }

  appendNewDaysData = e => {
    e.preventDefault()
    // let { daysData } = this.state
    // const b2Block = document.getElementById('b2-block')
    // const b4Block = document.getElementById('b4-block')
    // const b6Block = document.getElementById('b6-block')
    const unitWidth = document.getElementsByClassName('b6-hr')[0].clientWidth
    // calculate current month
    const scrollLeft = e.target.scrollLeft
    const curDate = this.state.daysData[Math.floor(scrollLeft / unitWidth)].date
    // decide whether to get new data
    const clientWidth = e.target.clientWidth
    const scrollWidth = e.target.scrollWidth
    // let newRealWidth = 0
    // get previous week
    if (scrollLeft < unitWidth) {
      // console.log('get previous week')
      // const d = moment(this.state.daysData[0].date, 'YYYYMMDD')
      // const firstD = d.day(-7).format('YYYYMMDD')
      // const lastD = d.day(6).format('YYYYMMDD')
      // console.log('previous firstD', firstD)
      // console.log('previous lastD', lastD)

      // e.target.scrollLeft = scrollLeft + 7 * unitWidth
      // daysData = daysData.concat(daysData)
      // newRealWidth = daysData.length * unitWidth
      // b2Block.style.width = `${newRealWidth}px`
      // b4Block.style.width = `${newRealWidth}px`
      // b6Block.style.width = `${newRealWidth}px`
    }
    // get next week
    if (scrollWidth - (scrollLeft + clientWidth) < unitWidth) {
      // console.log('get next week')
      // const l = this.state.daysData.length
      // const d = moment(this.state.daysData[l - 1].date, 'YYYYMMDD')
      // const firstD = d.day(7).format('YYYYMMDD')
      // const lastD = d.day(6).format('YYYYMMDD')
      // console.log('next firstD', firstD)
      // console.log('next lastD', lastD)

      // daysData = daysData.concat(daysData)
      // newRealWidth = daysData.length * unitWidth
      // b2Block.style.width = `${newRealWidth}px`
      // b4Block.style.width = `${newRealWidth}px`
      // b6Block.style.width = `${newRealWidth}px`
    }

    this.setState({
      curMonth: moment(curDate, 'YYYYMMDD').month(),
      // daysData,
    })
  }

  syncScrollB5 = e => {
    e.preventDefault()
    const b5Block = document.getElementById('b5')
    b5Block.scrollTop = e.target.scrollTop
  }

  emitScrollTop = _.throttle(e => {
    e.preventDefault()
    const { initScheduleScroll } = this.props
    // dispatch scrollTop
    initScheduleScroll({
      top: e.target.scrollTop,
    })
  }, 1000)

  amendScrollDist = _.debounce(e => {
    e.preventDefault()
    const { daysData } = this.state
    const { initScheduleScroll } = this.props
    const unitWidth = document.getElementsByClassName('b6-hr')[0].clientWidth
    const scrollLeft = e.target.scrollLeft
    const finalScrollIndex = Math.round(
      Math.round(scrollLeft / unitWidth * 100) / 100,
    )
    const finalScrollLeft = document.getElementById(
      `b2-${daysData[finalScrollIndex].date}`,
    ).offsetLeft
    e.target.scrollLeft = finalScrollLeft
    // dispatch scrollLeft
    initScheduleScroll({
      left: finalScrollLeft,
    })
  }, 500)

  setRealWidth = () => {
    const { daysData } = this.state
    const b2Block = document.getElementById('b2-block')
    const b4Block = document.getElementById('b4-block')
    const b6Block = document.getElementById('b6-block')
    const unitWidth = document.getElementsByClassName('b6-hr')[0].clientWidth
    const daysCount = daysData.length
    const realWidth = daysCount * unitWidth
    // unify initial scrollLeft
    b2Block.style.width = `${realWidth}px`
    b4Block.style.width = `${realWidth}px`
    b6Block.style.width = `${realWidth}px`
  }

  initScrollTopLeft = () => {
    const rightBlock = document.getElementById('right')
    const b6Block = document.getElementById('b6-block')
    const { clientWidth: unitWidth, clientHeight: unitHeight } 
      = document.getElementsByClassName('b6-hr')[0]
    const dayOfWeek = moment().day()
    const hourOfDay = moment().hour()
    const scrollLeft = dayOfWeek ? dayOfWeek * unitWidth : 7 * unitWidth
    const scrollTop = unitHeight * Math.max(hourOfDay - 2, 0)
    const { top, left } = this.props.scheduleScroll
    // set scroll left and top
    rightBlock.scrollLeft = left || scrollLeft
    b6Block.scrollTop = top || scrollTop
    // add scroll event handler
    rightBlock.addEventListener('scroll', this.appendNewDaysData)
    rightBlock.addEventListener('scroll', this.amendScrollDist)
    b6Block.addEventListener('scroll', this.syncScrollB5)
    b6Block.addEventListener('scroll', this.emitScrollTop)
  }

  removeScrollEventHandler = () => {
    const rightBlock = document.getElementById('right')
    const b6Block = document.getElementById('b6-block')

    rightBlock.removeEventListener('scroll', this.appendNewDaysData)
    rightBlock.removeEventListener('scroll', this.amendScrollDist)
    b6Block.removeEventListener('scroll', this.syncScrollB5)
    b6Block.removeEventListener('scroll', this.emitScrollTop)
  }

  formatDayTitle(d) {
    const { intl } = this.props
    const datetime = moment(d, 'YYYYMMDD')
    const date = datetime.date()
    const day = datetime.day()
    return `${date} ${intl.formatMessage({
      id: `Common.day${day}`,
    })}`
  }

  componentDidMount() {
    // const unitWidth = Math.round(
    //   document.getElementById('right').clientWidth * 100 / 3,
    // ) / 100
    this.setRealWidth()
    this.initScrollTopLeft()
  }

  componentWillUnmount() {
    this.removeScrollEventHandler()
  }

  componentWillReceiveProps(nextProps) {}

  componentDidUpdate() {}

  render() {
    const { intl } = this.props

    const renderDaysHeader = () => {
      return (
        <div key="0" id="b2-block" className="b2-block">
          {
            this.state.daysData.map((d, i) => {
              const isToday = this.today === d.date
              return (
                <div
                  key={`b2-${d.date}`}
                  id={`b2-${d.date}`}
                  className="b2"
                  style={{
                    color: isToday ? '#209CE2' : 'inherit',
                  }}
                >
                  { this.formatDayTitle(d.date) }
                </div>
              )
            })
          }
        </div>
      )
    }

    const renderAllDayEvents = () => {
      return (
        <div
          key="1"
          id="b4-block"
          className="b4-block"
        >
          {
            this.state.daysData.map((d, i) => {
              const isToday = this.today === d.date
              const isSunday = moment(d.date).day()
              const allDayEvents = d.allDayEvents || []
              return (
                <div
                  key={`b4-${d.date}`}
                  id={`b4-${d.date}`}
                  className={`b4${!isSunday ? ' is-sunday' : ''}`}
                  style={{
                    backgroundColor: isToday ?
                      'rgba(64, 176, 245, .05)' : 'inherit',
                  }}
                >
                  {
                    allDayEvents.map((e, k) => {
                      const isFirst = e.isFirst
                      return (
                        <div
                          key={`b4-row-${d.date}-${k}`}
                          id={`b4-row-${d.date}-${k}`}
                          className="b4-row"
                          style={{
                            paddingLeft: isFirst ? '0.1rem' : '0.2rem',
                            borderLeft: isFirst ? '0.1rem solid #08974F'
                              : 'none',
                          }}
                        >
                          { isFirst || !i ? e.title : '' }
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
      )
    }

    const renderDayEvents = () => {
      const hr = new Array(24)
      hr.fill(1)

      return (
        <div
          key="2"
          id="b6-block"
          className="b6-block"
        >
          <TimeLine />
          {
            this.state.daysData.map((d, i) => {
              const isToday = this.today === d.date
              const isSunday = moment(d.date).day()
              const dayEvents = d.dayEvents || []
              return (
                <div
                  key={`b6-${d.date}`}
                  id={`b6-${d.date}`}
                  className={`b6${!isSunday ? ' is-sunday' : ''}`}
                  style={{
                    backgroundColor: isToday ?
                      'rgba(64, 176, 245, .05)' : 'inherit',
                  }}
                >
                  { hr.map((h, r) => {
                    const last = hr.length - 1 === r
                    return (
                      <div
                        className={last ? 'b6-hr last' : 'b6-hr'}
                        key={`b6-hr-${r}`}
                      >
                        <hr />
                      </div>
                    )
                  })}
                  {
                    dayEvents.map((e, k) => {
                      const yWholeHeight = 1.31 * 24
                      return (
                        <div
                          key={`b6-row-${d.date}-${k}`}
                          id={`b6-row-${d.date}-${k}`}
                          className="b6-row"
                          style={{
                            top: `${e.yPos * yWholeHeight + 0.37}rem`,
                            left: `${e.xPos * 100}%`,
                            width: `${e.xWidth * 100}%`,
                            height: `${e.yHeight * yWholeHeight}rem`,
                          }}
                          onClick={e => console.log('click b6')}
                        >
                          { e.title }
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
      )
    }

    const renderRight = () => {
      return [renderDaysHeader(), renderAllDayEvents(), renderDayEvents()]
    }

    const renderTimeAxis = () => {
      const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
        '22:00', '23:00', '00:00']
      return times.map((t, i) => {
        return (
          <div key={i}>
            {t}
          </div>
        )
      })
    }

    return (
      <div className="schedule-management">
        <div id="headerBar" className="header-bar">
          <div className="left-content" />
          <div className="center-content">
            <FormattedMessage
              className="main-title"
              id={`Common.month${this.state.curMonth}`}
            />
          </div>
          <div className="right-content">
            <div className="btn">
              <Link to="/create-e">
                <Icon
                  className="add-btn"
                  role="button"
                  iconName="CalculatorAddition"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="main">
          <div className="left">
            <div id="b1" className="b1" />
            <div id="b3" className="b3">
              {
                intl.formatMessage({
                  id: 'Common.wholeday',
                })
              }
            </div>
            <div id="b5" className="b5">
              <TimeIndex />
              {renderTimeAxis()}
            </div>
          </div>
          <div className="right" id="right">
            {renderRight()}
          </div>
        </div>
      </div>
    )
  }
}

ScheduleManagement.propTypes = {
  intl: intlShape.isRequired,
  scheduleScroll: PropTypes.object.isRequired,
  initScheduleScroll: PropTypes.func.isRequired,
}

export default injectIntl(ScheduleManagement)
