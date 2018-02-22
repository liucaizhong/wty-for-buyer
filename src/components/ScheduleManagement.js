import React, { Component } from 'react'
// import { findDOMNode } from 'react-dom'
// import PropTypes from 'prop-types'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import moment from 'moment'
import Icon from './CustomIcon'

class ScheduleManagement extends Component {
  constructor(props) {
    super(props)

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

  componentDidMount() {
    // get b2&b4&b6
    const b2Block = document.getElementById('b2-block')
    const b4Block = document.getElementById('b4-block')
    const b6Block = document.getElementById('b6-block')
    // calculate scrollLeft
    // Sun: 0,...,Sat: 6
    if (!this.initial) {
      this.initial = true
      const dayOfWeek = moment().day()
      const b6Width = document.getElementsByClassName('b6')[0].clientWidth
      const rightBlock = document.getElementById('right')
      const rightWidth = rightBlock.clientWidth
      rightBlock.style.width = `${rightWidth}px`
      const scrollLeft = dayOfWeek ? dayOfWeek * b6Width : 7 * b6Width
      // unify initial scrollLeft
      b2Block.style.width = `${rightWidth}px`
      b2Block.scrollLeft = scrollLeft
      b4Block.style.width = `${rightWidth}px`
      b4Block.scrollLeft = scrollLeft
      b6Block.style.width = `${rightWidth}px`
      b6Block.scrollLeft = scrollLeft
    }

    // calculate the first&last date of request's domain
    // const firstD = moment().day(0).format('YYYYMMDD')
    // const lastD = moment().day(6).format('YYYYMMDD')
    let setFinalScrollLeftTimer
    const scrollEventHandler = (e) => {
      // calculate current month
      const unitWidth = document.getElementsByClassName('b2')[0].clientWidth
      const scrollLeft = e.target.scrollLeft
      const curDate = this.state.daysData[Math.floor(scrollLeft / unitWidth)].date
      // a timer func for setting final scrollLeft
      if(setFinalScrollLeftTimer) {
        clearTimeout(setFinalScrollLeftTimer)
      }
      setFinalScrollLeftTimer = setTimeout(() => {
        const finalScrollLeft = Math.round(scrollLeft / unitWidth) * unitWidth
        b2Block.scrollLeft = finalScrollLeft
        b4Block.scrollLeft = finalScrollLeft
        b6Block.scrollLeft = finalScrollLeft
      }, 300)
      // sync scrollLeft of b2&b4&b6
      b2Block.scrollLeft = scrollLeft
      if (!Object.is(e.target, b4Block)) {
        b4Block.scrollLeft = scrollLeft
      }
      if (!Object.is(e.target, b6Block)) {
        b6Block.scrollLeft = scrollLeft
      }
      // decide whether to get new data
      const clientWidth = e.target.clientWidth
      const scrollWidth = e.target.scrollWidth
      // get previous week
      if (scrollLeft < 5) {
        console.log('get previous week')
        const d = moment(this.state.daysData[0].date, 'YYYYMMDD')
        const firstD = d.day(-7).format('YYYYMMDD')
        const lastD = d.day(6).format('YYYYMMDD')
        console.log('previous firstD', firstD)
        console.log('previous lastD', lastD)
      }
      // get next week
      if (scrollWidth - (scrollLeft + clientWidth) < 5) {
        console.log('get next week')
        const l = this.state.daysData.length
        const d = moment(this.state.daysData[l - 1].date, 'YYYYMMDD')
        const firstD = d.day(7).format('YYYYMMDD')
        const lastD = d.day(6).format('YYYYMMDD')
        console.log('next firstD', firstD)
        console.log('next lastD', lastD)
      }

      this.setState({
        curMonth: moment(curDate, 'YYYYMMDD').month(),
      })
    }

    b4Block.onscroll = scrollEventHandler
    b6Block.onscroll = scrollEventHandler
  }

  componentWillReceiveProps(nextProps) {}

  formatDayTitle(d) {
    const { intl } = this.props
    const datetime = moment(d, 'YYYYMMDD')
    const date = datetime.date()
    const day = datetime.day()
    return `${date} ${intl.formatMessage({
      id: `Common.day${day}`,
    })}`
  }

  render() {
    const { intl } = this.props

    const renderDaysHeader = () => {
      return (
        <div key="0" id="b2-block" className="b2-block fixed">
          {
            this.state.daysData.map((d, i) => {
              const isToday = this.today === d.date
              return (
                <div
                  key={`b2-${i}`}
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
          className="b4-block fixed"
        >
          {
            this.state.daysData.map((d, i) => {
              const isToday = this.today === d.date
              const isSunday = moment(d.date).day()
              const allDayEvents = d.allDayEvents || []
              return (
                <div
                  key={`b4-${i}`}
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
                          key={`b4-row-${k}`}
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
          className="b6-block fixed"
        >
          {
            this.state.daysData.map((d, i) => {
              const isToday = this.today === d.date
              const isSunday = moment(d.date).day()
              const dayEvents = d.dayEvents || []
              return (
                <div
                  key={`b6-${i}`}
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
                      const yWholeHeight = 1.31 * 25
                      return (
                        <div
                          key={`b6-row-${k}`}
                          className="b6-row"
                          style={{
                            top: `${e.yPos * yWholeHeight + 0.37}rem`,
                            left: `${e.xPos * 100}%`,
                            width: `${e.xWidth * 100}%`,
                            height: `${e.yHeight * 100}%`,
                          }}
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
        <div id="headerBar" className="header-bar fixed">
          <div className="left-content" />
          <div className="center-content">
            <FormattedMessage
              className="main-title"
              id={`Common.month${this.state.curMonth}`}
            />
          </div>
          <div className="right-content">
            <div className="btn">
              <Icon
                className={'add-btn'}
                role="button"
                iconName="CalculatorAddition"
                onClick={(e) => {
                  console.log('click add btn')
                }}
              /> 
            </div>
          </div>
        </div>
        <div className="main">
          <div className="left">
            <div id="b1" className="b1 fixed" />
            <div id="b3" className="b3 fixed">
              {
                intl.formatMessage({
                  id: 'Common.wholeday',
                })
              }
            </div>
            <div id="b5" className="b5 fixed">
              {renderTimeAxis()}
            </div>
          </div>
          <div className="right" id="right">
            {renderRight()}
            {/* <div className="b4-block">
              {
                this.state.wholeEvents.map((e, i) => {
                  return (
                    <div
                      key={i}
                      className="b4-row"
                    >
                      {
                        e.map((item, k) => {
                          const start = moment(item.start, 'YYYYMMDD')
                          const realStart = moment.max(start,
                            moment(this.state.startDate, 'YYYYMMDD'))
                          const isStartDay = item.start === realStart.format('YYYYMMDD')
                          let duration = moment(item.end, 'YYYYMMDD') - realStart
                          duration = moment.duration(duration).days() + 1
                          return (
                            <div
                              key={k}
                              style={{
                                width: `${duration * 33.3333}%`,
                                paddingLeft: isStartDay ? '0.1rem' : '0.2rem',
                                background: 'rgba(85, 250, 167, 0.5)',
                                borderLeft: isStartDay ? '0.1rem solid #08974F'
                                  : 'none',
                              }}
                            >
                              { item.title }
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div> */}
            {/* {
              this.state.daysData.map((d, i) => {
                const isToday = this.today === d.date
                return (
                  <div key={i} className="right-part">
                    <div className="b2">
                      <div
                        className="b2-part"
                        style={{
                          color: isToday ? '#209CE2' : 'inherit',
                        }}
                      >
                        { this.formatDayTitle(d.date) }
                      </div>
                    </div>
                    <div
                      className="b4"
                      style={{
                        backgroundColor: isToday ?
                          'rgba(64, 176, 245, .05)' : 'inherit',
                      }}
                    />
                    <div className="b6">
                      <div className="b6-back">b6-back
                      </div>
                      <div className="b6-front">b6-front
                      </div>
                    </div>
                  </div>
                )
              })
            } */}
          </div>
        </div>
      </div>
    )
  }
}

ScheduleManagement.propTypes = {
  intl: intlShape.isRequired,
}

export default injectIntl(ScheduleManagement)
