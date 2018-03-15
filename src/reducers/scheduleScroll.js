const scheduleScroll = (state={
  top: 0,
  left: 0,
}, action) => {
  switch(action.type) {
  case 'INIT_SCHEDULE_SCROLL':
    return Object.assign({}, state, action.scroll)
  default:
    return state
  }
}

export default scheduleScroll
