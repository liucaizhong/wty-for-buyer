import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import moment from 'moment'
import { Modal } from 'office-ui-fabric-react/lib/Modal'
import Icon from './CustomIcon'
import Calendar from './Calendar'

class IntervalSetter extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    days: PropTypes.array,
    times: PropTypes.array,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      oneDay: props.days.length <= 1,
      days: props.days && props.days.length
        ? [...props.days]
        : [moment().format('YYYYMMDD')],
      times: props.times && props.times.length
        ? [...props.times]
        : ['8:00', '9:00'],
      showLeftModal: true,
      showRightModal: false,
    }
  }

  calcTimeConsuming = times => {
    const { intl } = this.props
    let consuming = moment(times[1], 'HH:mm').diff(moment(times[0], 'HH:mm'), 'minutes')
    let h = Math.trunc(consuming / 60)
    let m = consuming % 60
    return [h ? `${h}${intl.formatMessage({
      id: 'Common.hour',
    })}` : '', m ? `${m}${intl.formatMessage({
      id: 'Common.minute',
    })}` : ''].join``
  }

  dateToStr = d => {
    const { intl } = this.props

    return `${d.month() + 1}${intl.formatMessage({
      id: 'Common.month',
    })}${d.date()}${intl.formatMessage({
      id: 'Common.day',
    })} ${intl.formatMessage({
      id: `Common.day${d.day()}`,
    })}`
  }

  composeDateLitera = (date, f = false) => {
    const { intl } = this.props
    let dateObj = typeof date === 'string'
      ? moment(date)
      : date
    let today = moment(moment().format('YYYYMMDD'))
    let daysInterval = dateObj.diff(today, 'days')
    
    switch (daysInterval) {
    case 0:
      return f
        ? intl.formatMessage({
          id: 'Common.today',
        })
        : this.dateToStr(dateObj)
    case -1:
      return f
        ? intl.formatMessage({
          id: 'Common.yesterday',
        })
        : this.dateToStr(dateObj)
    case 1:
      return f
        ? intl.formatMessage({
          id: 'Common.tomorrow',
        })
        : this.dateToStr(dateObj)
    default:
      return this.dateToStr(dateObj)
    }
  }

  composeDateDesc = date => {
    const { intl } = this.props
    let dateObj = typeof date === 'string'
      ? moment(date)
      : date
    let today = moment(moment().format('YYYYMMDD'))
    let daysInterval = dateObj.diff(today, 'days')

    if (!daysInterval) {
      return intl.formatMessage({
        id: 'Common.today',
      }) 
    } else if (daysInterval > 0) {
      if (daysInterval === 1) {
        return intl.formatMessage({
          id: 'Common.tomorrow',
        })
      } else {
        return intl.formatMessage({
          id: 'Common.afterdays',
        }, {
          num: daysInterval,
        })
      }
    } else {
      if (daysInterval === -1) {
        return intl.formatMessage({
          id: 'Common.yesterday',
        })
      } else {
        return intl.formatMessage({
          id: 'Common.beforedays',
        }, {
          num: daysInterval,
        })
      }
    }
  }
  
  itemDown = e => {
    e.currentTarget.className += ' active'
  }

  itemUp = e => {
    e.currentTarget.className = e.currentTarget.className.replace('active', '').trim()
  }

  componentDidMount() {
    const contentEl = document.getElementsByClassName('content')
    Array.prototype.forEach.call(contentEl, el => {
      el.addEventListener('mousedown', this.itemDown)
      el.addEventListener('mouseup', this.itemUp)
      el.addEventListener('touchstart', this.itemDown)
      el.addEventListener('touchend', this.itemUp)
    })
  }

  render () {
    const { oneDay, days, times, showLeftModal, showRightModal } = this.state
    const { intl } = this.props

    return (
      <div
        className="interval-setter"
      >
        {
          oneDay
            ? <Fragment>
              <div
                className="content"
                onClick={() => {
                  this.setState({
                    showLeftModal: true,
                  })
                }}
              >
                <header className="title">
                  {
                    intl.formatMessage({
                      id: 'Common.date',
                    })
                  }
                </header>
                <section className="text">
                  { this.composeDateLitera(days[0]) }
                </section>
                <footer className="extra">
                  { this.composeDateDesc(days[0]) }
                </footer>
              </div>
              <div
                className="content"
                onClick={() => {
                  this.setState({
                    showRightModal: true,
                  })
                }}
              >
                <header className="title">
                  {
                    intl.formatMessage({
                      id: 'Common.time',
                    }) + '(GMT+8)'
                  }
                </header>
                <section className="text">
                  {
                    <Fragment>
                      { times[0] }
                      <Icon
                        className="forward"
                        iconName="Forward"
                      />
                      { times[1] }
                    </Fragment>
                  }
                </section>
                <footer className="extra">
                  {
                    intl.formatMessage({
                      id: 'CreateEvent.timeConsuming',
                    }, {
                      litera: this.calcTimeConsuming(times),
                    })
                  }
                </footer>
              </div>
            </Fragment> 
            : <Fragment>
              <div
                className="content"
                onClick={() => {
                  this.setState({
                    showLeftModal: true,
                  })
                }}
              >
                <header className="title">
                  {
                    intl.formatMessage({
                      id: 'Common.start',
                    })
                  }
                </header>
                <section className="text">
                  { this.composeDateLitera(days[0])}
                </section>
                <footer className="extra">
                  { times[0] }
                </footer>
              </div>
              <div
                className="content"
                onClick={() => {
                  this.setState({
                    showRightModal: true,
                  })
                }}
              >
                <header className="title">
                  {
                    intl.formatMessage({
                      id: 'Common.end',
                    })
                  }
                </header>
                <section className="text">
                  { this.composeDateLitera(days[1]) }
                </section>
                <footer className="extra">
                  { times[1] }
                </footer>
              </div>
            </Fragment>
        }
        <Modal
          containerClassName="interval-setter__modal"
          isOpen={ showLeftModal }
          isBlocking={ false }
          onDismiss={() => {
            this.setState({
              showLeftModal: false,
            })
          }}
        >
          {/*days*/
            oneDay
              ? <Calendar
                daySelected={days}
                timeSelected={times}
                headerRight={
                  <Icon
                    className="accept"
                    iconName="Accept"
                    onClick={e => {
                      console.log('click save btn')
                    }}
                  />
                }
              />
              : <div>left modal</div>
          }
        </Modal>
        <Modal
          containerClassName="interval-setter__modal"
          isOpen={ showRightModal }
          isBlocking={ false }
          onDismiss={() => {
            this.setState({
              showRightModal: false,
            })
          }}
        >
          <div>right modal</div>
        </Modal>
      </div>
    )
  }
}

export default injectIntl(IntervalSetter)
