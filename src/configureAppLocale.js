import moment from 'moment'
import LANGS from './locales/langList'

// get language
const navigatorLang = navigator.language.toLowerCase()
const showLangMap = [...LANGS].filter(
  ([k]) => !navigatorLang.localeCompare(k),
)

export default function configureAppLocale() {
  switch (showLangMap[1]) {
  case 0: {
    const appLocaleData = require('react-intl/locale-data/zh')
    const zhMessages = require('./locales/zh_cn')
    const momentData = require('moment/locale/zh-cn')
    moment.updateLocale('zh-cn', momentData)

    return Object.assign({}, {
      messages: {
        ...zhMessages,
      },
      locale: 'zh-CN',
      data: appLocaleData,
    })
  }
  case 1: {
    // support further
    // const antdEn = require('antd-mobile/lib/locale-provider/en_US')
    // const appLocaleData = require('react-intl/locale-data/en')
    // const enMessages = require('./locales/en_us')
    //
    // return Object.assign({}, {
    //   messages: {
    //     ...enMessages,
    //   },
    //   antd: antdEn,
    //   locale: 'en-US',
    //   data: appLocaleData,
    // })
    break
  }
  default: {
    const appLocaleData = require('react-intl/locale-data/zh')
    const zhMessages = require('./locales/zh_cn')
    const momentData = require('moment/locale/zh-cn')
    moment.updateLocale('zh-cn', momentData)

    return Object.assign({}, {
      messages: {
        ...zhMessages,
      },
      locale: 'zh-CN',
      data: appLocaleData,
    })
  }
  }
}
