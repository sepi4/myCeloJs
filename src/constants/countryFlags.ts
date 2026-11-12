import { CountryFlagsLocation } from '../types'

const flagModules = import.meta.glob('../assets/img/countryFlags/*.png', {
    eager: true,
}) as Record<string, { default: string }>

export const countryFlags: CountryFlagsLocation = {}
Object.entries(flagModules).forEach(([path, mod]) => {
    const filename = path.split('/').pop() ?? ''
    const code = filename.substring(0, 2)
    countryFlags[code] = mod.default
})
