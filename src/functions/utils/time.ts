import 'dayjs/locale/en'
import 'dayjs/locale/ru'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

export function getTimeAgo(date: Date, lg: string, withoutSuffix = false): string {
    dayjs.extend(relativeTime)
    return dayjs(date).locale(lg).from(dayjs(), withoutSuffix)
}

// LL = localized long date (e.g. "March 14, 2026"), LT = time (e.g. "2:30 PM").
// The date is shown once when the game starts and ends on the same day.
export function getTimeRange(start: Date, end: Date, lg: string): string {
    dayjs.extend(localizedFormat)
    const s = dayjs(start).locale(lg)
    const e = dayjs(end).locale(lg)
    if (s.isSame(e, 'day')) {
        return `${s.format('LL LT')}–${e.format('LT')}`
    }
    return `${s.format('LL LT')} – ${e.format('LL LT')}`
}

export function getTime(ms: number): string {
    dayjs.extend(duration)
    return dayjs.duration(ms).format('HH:mm:ss')
}
