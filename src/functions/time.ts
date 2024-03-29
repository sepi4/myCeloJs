import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import 'dayjs/locale/en'
import 'dayjs/locale/ru'

export function getTimeAgo(date: Date, lg: string) {
    dayjs.extend(relativeTime)
    return dayjs(date).locale(lg).from(dayjs())
}

export function getDateTime(date: Date, lg: string) {
    dayjs.extend(localizedFormat)
    // const result = dayjs(ms).format('DD.MM.YYYY, HH:mm')
    const result = dayjs(date).locale(lg).format('LL LTS')
    return result
}

export function getTime(ms: number) {
    dayjs.extend(duration)
    const result = dayjs.duration(ms).format('HH:mm:ss')
    return result
}
