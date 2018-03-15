import * as TYPES from './type'

// define factory function for generating action creator
function makeActionCreator(type, ...argNames) {
  return (...args) => {
    const action = { type }
    argNames.forEach((arg, index) => {
      action[arg] = args[index]
    })
    return action
  }
}

export const initScheduleScroll = makeActionCreator(
  TYPES.INIT_SCHEDULE_SCROLL,
  'scroll',
)