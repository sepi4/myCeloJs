import 'dayjs/locale/en'
import 'dayjs/locale/ru'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

export function getTimeAgo(date: Date, lg: string): string {
    dayjs.extend(relativeTime)
    return dayjs(date).locale(lg).from(dayjs())
}

// LL = localized long date (e.g. "March 14, 2026"), LTS = time with seconds (e.g. "2:30:15 PM")
export function getDateTime(date: Date, lg: string): string {
    dayjs.extend(localizedFormat)
    return dayjs(date).locale(lg).format('LL LTS')
}

export function getTime(ms: number): string {
    dayjs.extend(duration)
    return dayjs.duration(ms).format('HH:mm:ss')
}
