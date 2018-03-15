import { connect } from 'react-redux'
import { initScheduleScroll } from '../actions/index'
import ScheduleManagement from '../components/ScheduleManagement'

const mapStateToProps = state => {
  return {
    scheduleScroll: state.scheduleScroll,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initScheduleScroll: (top, left) => {
      dispatch(initScheduleScroll(top, left))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleManagement)
