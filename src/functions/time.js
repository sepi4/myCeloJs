import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en'
import 'dayjs/locale/ru'

export function getTimeAgo(ms, lg) {
    dayjs.extend(relativeTime)

    return dayjs().locale(lg).to(dayjs(ms))
}