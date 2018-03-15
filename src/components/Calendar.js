import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import moment from 'moment'
import _ from 'lodash'
import Icon from './CustomIcon'
import NavBar from './NavBar'

class Calendar extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    header: PropTypes.bool,
    footer: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
    ]),
    headerLeft: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
    ]),
    daySelected: PropTypes.array,
    timeSelected: PropTypes.array,
    headerRight: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
    ]),
    onChange: PropTypes.func,
  }

  static defaultProps = {
    header: true,
  }

  constructor(props) {
    super(props)

    const daySelected = props.daySelected && props.daySelected.length
      ? [...props.daySelected]
      : [moment().format('YYYYMMDD')]

    this.state = {
      daySelected,
      timeSelected: props.timeSelected && props.timeSelected.length
        ? [...props.timeSelected]
        : [],
      dayNum: this.generateDayNum(daySelected),
    }
  }

  dateToStr = date => {
    const { intl } = this.props
    const d = moment(date, 'YYYYMMDD') 

    return `${d.month() + 1}${intl.formatMessage({
      id: 'Common.month',
    })}${d.date()}${intl.formatMessage({
      id: 'Common.day',
    })} ${intl.formatMessage({
      id: `Common.day${d.day()}`,
    })}`
  }

  generateDayNum = daySelected => {
    const dayNum = []
    const startYear = moment().year() - 1
    const startDay = moment([startYear]).dayOfYear(1)
    const startDayOfWeek = startDay.day()
    const dayCount = [startYear, startYear + 1, startYear + 2].map(
      y => moment([y]).isLeapYear(),
    ).reduce((t, b) => t + (b ? 366 : 365), 0)
    // init first week
    const firstWeek = new Array(7)
    firstWeek.fill(null)
    for (let i = startDayOfWeek; i < 7; ++ i) {
      firstWeek[i] = this.composeDayNumObj(startDay, daySelected)
      startDay.add(1, 'd')
    }
    dayNum.push(firstWeek)
    // init remaining weeks
    for (let i = 0; i < dayCount - 7 + startDayOfWeek; i += 7) {
      dayNum.push([0, 1, 2, 3, 4, 5, 6].map(v => {
        let t = this.composeDayNumObj(startDay, daySelected)
        startDay.add(1, 'd')
        return t
      }))
    }
    return dayNum
  }

  composeDayNumObj = (obj, selected) => {
    let start = selected[0]
    let end = selected[1]
    let { years: y, months: m, date: d } = obj.toObject()
    const temp = {
      d,
      m: m + 1,
      y,
      a: moment().diff(obj, 'd') > 0 ,
      s: false,
      p: 0,
    }

    if (moment([y, m, d]).isSame(start)) {
      Object.assign(temp, {
        s: true,
        p: -1,
      })
      return temp
    }

    if (end && moment([y, m, d]).isBetween(start, end, null, '()')) {
      Object.assign(temp, {
        s: true,
        p: 0,
      })
      return temp
    }

    if (end && moment([y, m, d]).isSame(end)) {
      Object.assign(temp, {
        s: true,
        p: 1,
      })
      return temp
    }

    return temp
  }

  amendScrollDist = _.debounce(e => {
    e.preventDefault()
    
    const calendarCaption = document.getElementById('calendar-caption')
    const calendarHeader = document.getElementById('calendar-header')
    const unitHeight = document.querySelector('.calendar-body > tr').clientHeight
    const scrollTop = e.target.scrollTop
    const finalScrollIndex = Math.round(
      Math.round(scrollTop / unitHeight * 100) / 100,
    )
    const finalScrollTop = document.getElementById(
      `week-${finalScrollIndex}`,
    ).offsetTop - calendarCaption.clientHeight
    -calendarHeader.clientHeight - 1
    e.target.scrollTop = finalScrollTop
  }, 500)

  selectDate = date => {
    const { daySelected } = this.state
    const dateObj =moment([date.y, date.m - 1, date.d])
    const dateStr = dateObj.format('YYYYMMDD')
    if (daySelected[1]) {
      const diff = moment(daySelected[1]).diff(daySelected[0], 'd')
      const newDaySelected = [dateStr, dateObj.add(diff, 'd').format('YYYYMMDD')]
      this.setState({
        daySelected: newDaySelected,
        dayNum: this.generateDayNum(newDaySelected),
      })
    } else {
      this.setState({
        daySelected: [dateStr],
        dayNum: this.generateDayNum([dateStr]),
      })
    }

  }

  componentDidMount() {
    // init scrollHeight
    const calendarCaption = document.getElementById('calendar-caption')
    const calendarHeader = document.getElementById('calendar-header')
    const calendarBody = document.getElementById('calendar-body')
    const selectedTr = document.getElementsByClassName('day-selected')[0]
    calendarBody.scrollTop = -calendarCaption.clientHeight +
      -calendarHeader.clientHeight +
      selectedTr.parentElement.previousElementSibling.offsetTop - 1
    
    calendarBody.addEventListener('scroll', this.amendScrollDist)
  }

  componentWillUnmount() {
    const calendarBody = document.getElementById('calendar-body')
    calendarBody.removeEventListener('scroll', this.amendScrollDist)
  }

  render () {
    const { intl, className, style, headerLeft, headerRight, header, footer } = this.props
    const { daySelected, timeSelected, dayNum } = this.state
    const dayTitle = [0, 1, 2, 3, 4, 5, 6].map(v => intl.formatMessage({
      id: `Common.day${v}`,
    })[1])

    // console.log('dayNum', dayNum)
    return (
      <table
        id="calendar"
        className={`calendar ${className || ''}`.trim()}
        style={{...style}}
      >
        {
          header
            ? <caption id="calendar-caption" className="calendar-caption">
              <NavBar
                leftContent={ headerLeft }
                rightContent={ headerRight }
              >
                <Fragment>
                  <div className="date">
                    { this.dateToStr(daySelected[0]) }
                  </div>
                  {
                    timeSelected.length
                      ? <div className="time">
                        {
                          <Fragment>
                            { timeSelected[0] }
                            <Icon
                              className="forward"
                              iconName="Forward"
                            />
                            { timeSelected[1] }
                          </Fragment>
                        }
                      </div>
                      : null
                  }
                </Fragment>
              </NavBar>
            </caption>
            : null
        }
        <thead id="calendar-header" className="calendar-header">
          <tr>
            {
              dayTitle.map((v, i) => (
                <th key={i}>
                  <div>
                    { v }
                  </div>
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody id="calendar-body" className="calendar-body">
          {
            dayNum.map((w, k) => (
              <tr key={k} id={`week-${k}`}>
                {
                  w.map((v, i) => (
                    <td
                      key={i}
                      className={`${v.s ? 'day-selected' : ''}`}
                      style={v.a ? {
                        backgroundColor: 'rgba(218, 240, 252, .2)',
                      } : null}
                    >
                      <div
                        className="day-num"
                        onClick={e => {
                          e.preventDefault()
                          this.selectDate(v)
                        }}
                      >
                        {
                          v ? v.s ? <Fragment>
                            <div className="day"
                              style={v.p ?
                                v.p === -1 ?
                                  daySelected.length === 1 ?
                                    {
                                      backgroundColor: '#209CE2',
                                      color: '#fff',
                                      borderRadius: '50%',
                                      margin: '3px',
                                      lineHeight: '2.2',
                                    } : {
                                      backgroundColor: '#209CE2',
                                      color: '#fff',
                                      borderRadius: '50% 0 0 50%',
                                      margin: '3px 0px 3px 3px',
                                      lineHeight: '2.2',
                                    }
                                  : {
                                    backgroundColor: '#209CE2',
                                    color: '#fff',
                                    borderRadius: '0 50% 50% 0',
                                    margin: '3px 3px 3px 0',
                                    lineHeight: '2.2',
                                  }
                                : {
                                  backgroundColor: '#209CE2',
                                  color: '#fff',
                                  borderRadius: '0',
                                  margin: '3px 0',
                                  lineHeight: '2.2',
                                }
                              }
                            >
                              { v.d }
                            </div>
                          </Fragment>
                            : <Fragment>
                              {
                                v.d === 1 ? 
                                  <div className="month"
                                    style={v.m !== 1 ? {
                                      lineHeight: '2',
                                    } : null}
                                  >
                                    { v.m + intl.formatMessage({
                                      id: 'Common.month',
                                    })}
                                  </div>
                                  : null
                              }
                              <div className="day"
                                style={v.m === 1 && v.d === 1 ? {
                                  fontSize: '.22rem',
                                } : v.d === 1 ? {
                                  lineHeight: '1',
                                } : {
                                  lineHeight: '2.5',
                                }}
                              >
                                { v.d }
                              </div>
                              {
                                v.m === 1 && v.d === 1 ?
                                  <div className="year">
                                    { v.y }
                                  </div>
                                  : null
                              }
                            </Fragment>
                            : null
                        }
                      </div>
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
        {
          footer
            ? <tfooter className="calendar-footer">
              { footer }
            </tfooter>
            : null
        }
      </table>
    )
  }
}

export default injectIntl(Calendar)
