import { copyObj } from './functions/simpleFunctions'

// Reducer
function reducer(state, action) {
    switch (action.type) {
        case 'TOGGLE_SETTINGS_VIEW':
            return {
                ...state,
                settingsView: !state.settingsView,
            }

        case 'SET_EXTRA_INFO':
            return {
                ...state,
                extraInfo: action.data.extraInfo,
                players: action.data.newPlayers,
            }

        case 'CLEAR_EXTRA_INFO':
            return {
                ...state,
                extraInfo: null,
            }

        case 'SET_NEW_PLAYERS':
            return {
                ...state,
                extraInfo: null,
                fromFile: action.data,
                players: action.data,
                openInfos: [
                    [false, false, false, false],
                    [false, false, false, false],
                ],
            }

        case 'SET_SETTINGS':
            return {
                ...state,
                settings: action.data,
            }

        case 'TOGGLE_NAVBUTTON':
            // eslint-disable-next-line no-case-declarations
            let obj = copyObj(state.navButtons)
            obj[action.key] = !obj[action.key]
            localStorage.setItem(
                'navButtons',
                JSON.stringify(obj),
            )
            return {
                ...state,
                navButtons: obj,
            }

        case 'TOGGLE_EXTRA':
            return {
                ...state,
                openInfos: state.openInfos
                    .map((t, i) => i === action.data.teamIndex
                        ? t.map((p, j) => j === action.data.playerIndex
                            ? !p
                            : p
                        )
                        : t
                    )
            }

        case 'SET_SORTER':
            return {
                ...state,
                sorter: state.sorter.name === action.data.name
                    ? {
                        fun: action.data.fun,
                        name: action.data.name,
                        reversed: !state.sorter.reversed,
                    }
                    : {
                        fun: action.data.fun,
                        name: action.data.name,
                        reversed: false,
                    },
            }

        default:
            return state
    }
}

export default reducer