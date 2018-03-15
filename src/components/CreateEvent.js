import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'
import Icon from './CustomIcon'
import NavBar from './NavBar'
import List from './List'
import WhiteSpace from './WhiteSpace'
import IntervalSetter from './IntervalSetter'

const Item = List.Item

class CreateEvent extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    days: [],
    times: [],
  }

  onSetInterval = (days, times) => {
    console.log('days', days)
    console.log('times', times)
    this.setState({
      days,
      times,
    })
  }

  render () {
    const { intl, history } = this.props
    const { days, times } = this.state

    return (
      <div className="create-event">
        <NavBar
          leftContent={<Icon
            className="btn"
            role="button"
            iconName="Cancel"
            onClick={e => {
              e.preventDefault()
              history.goBack()
            }}
          />}
          rightContent={<Icon
            className="btn"
            role="button"
            iconName="Accept"
            onClick={e => {
              e.preventDefault()
              history.goBack()
            }}
          />}
        >
          {
            intl.formatMessage({
              id: 'CreateEvent.mainTitle',
            })
          }
        </NavBar>
        <WhiteSpace size="xl" />
        <List className="list__title-input">
          <Item
            thumb={<Icon
              className="btn"
              role="button"
              iconName="LocationDot"
              style={{
                fontSize: '.5rem',
                color: '#3CB410',
              }}
            />}
          >
            <TextField
              className="title-input"
              borderless
              placeholder={intl.formatMessage({
                id: 'CreateEvent.titleInputPlaceholder',
              })}
            />
          </Item>
        </List>
        <WhiteSpace size="xl" />
        <List className="list__wholeday-input">
          <Item
            thumb={<Icon
              className="btn"
              type={require('../assets/icons/clock.svg')}
            />}
            extra={<Toggle
              defaultChecked={ false }
              styles={{
                root: {
                  marginBottom: 0,
                },
                container: {
                  verticalAlign: 'middle',
                },
                pill: {
                  fontSize: '.5rem',
                  borderColor: 'rgba(134, 134, 134, 0.2)',
                  width: '.98rem',
                  height: '.53rem',
                  boxShadow: '.3px .3px 2px .3px #B0B0B0 inset',
                },
                pillChecked: {
                  boxShadow: 'none',
                  background: '#209CE2',
                },
                pillHovered: {
                  borderColor: 'rgba(134, 134, 134, 0.2)',
                },
                thumb: {
                  width: '.5rem',
                  height: '.5rem',
                  backgroundColor: '#fff',
                  borderColor: 'rgba(134, 134, 134, 0.2)',
                  borderWidth: '1px',
                  top: '0',
                  left: '0',
                  boxShadow: '.8px .8px 3px 1px #B0B0B0',
                },
                thumbChecked: {
                  left: '.44rem',
                  boxShadow: '.8px .8px 3px 1px #209CE2',
                }, 
              }}
            />}
          >
            {
              intl.formatMessage({
                id: 'Common.wholeday',
              })
            }
          </Item>
        </List>
        <List className="list__interval-input">
          <Item>
            <IntervalSetter
              days={days}
              times={times}
              onChange={this.onSetInterval}
            />
          </Item>
        </List>
        <WhiteSpace size="xl" />
        <List className="list__people-input">
          <Item
            thumb={<Icon
              className="btn"
              type={require('../assets/icons/user.svg')}
            />}
            arrow
            onClick={() => {}}
          >
            {
              intl.formatMessage({
                id: 'CreateEvent.peopleInput',
              })
            }
          </Item>
        </List>
        <WhiteSpace size="xl" />
        <List className="list__place-desc-input">
          <Item
            thumb={<Icon
              className="btn"
              type={require('../assets/icons/map-marker.svg')}
            />}
            arrow
            onClick={() => {}}
          >
            {
              intl.formatMessage({
                id: 'CreateEvent.placeInput',
              })
            }
          </Item>
          <Item
            thumb={<Icon
              className="btn"
              type={require('../assets/icons/desc.svg')}
            />}
            arrow
            onClick={() => {}}
          >
            {
              intl.formatMessage({
                id: 'CreateEvent.descInput',
              })
            }
          </Item>
        </List>
      </div>
    )
  }
}

export default injectIntl(CreateEvent)
