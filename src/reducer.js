import { copyObj } from './functions/simpleFunctions'

// Reducer
function reducer(state, action) {
    switch (action.type) {
        case 'TOGGLE_SETTINGS_VIEW':
            return {
                ...state,
                settingsView: !state.settingsView,
            }

        case 'TOGGLE_AUTO_LOG_CHECKING':
            localStorage.setItem(
                'autoLogChecking',
                JSON.stringify(!state.autoLogChecking),
            )
            return {
                ...state,
                autoLogChecking: !state.autoLogChecking,
            }

        case 'TOGGLE_ALERT':
            localStorage.setItem(
                'alert',
                JSON.stringify(!state.alert),
            )
            return {
                ...state,
                alert: !state.alert,
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

        case 'SET_INTERVAL':
            localStorage.setItem(
                'logCheckInterval',
                JSON.stringify(action.data),
            )
            return {
                ...state,
                logCheckInterval: action.data,
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

        case 'UPDATE_CHECK_DONE':
            return {
                ...state,
                updateCheckDone: true,
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
                playerCard: {
                    player: null,
                },
                view: 'main',

            }

        case 'SET_SETTINGS':
            return {
                ...state,
                settings: action.data,
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

        case 'TO_MAIN_VIEW':
            return {
                ...state,
                view: 'main',
            }

        case 'PLAYER_CARD_ON':
            return {
                ...state,
                view: 'playerCard',
                playerCard: {
                    ...state.playerCard,
                    player: action.data.player,
                    extraInfo: action.data.extraInfo,
                }
            }
        case 'SEARCH_VIEW_ON':
            return {
                ...state,
                view: 'search',
            }

        case 'SET_FOUND_PLAYERS':
            return {
                ...state,
                foundPlayers: action.data,
            }


        default:
            return state
    }
}

export default reducer