import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import 'dayjs/locale/en'
import 'dayjs/locale/ru'

export function getTimeAgo(ms, lg) {
    dayjs.extend(relativeTime)
    return dayjs(ms).locale(lg).from(dayjs())
}

export function getDateTime(ms, lg) {
    dayjs.extend(localizedFormat)
    // const result = dayjs(ms).format('DD.MM.YYYY, HH:mm')
    const result = dayjs(ms).locale(lg).format('LL LTS')
    console.log('result:', result)
    return result
}

export function getTime(ms) {
    dayjs.extend(duration)
    const result = dayjs.duration(ms).format('HH:mm:ss')
    return result
}