interface LogCheckInterval {
    key: 'logCheckInterval';
    def: number;
}
interface AutoLogChecking {
    key: 'autoLogChecking';
    def: boolean;
}
interface Alert {
    key: 'alert';
    def: boolean;
}
interface NavButtons {
    key: 'navButtons';
    def: {
        all: boolean;
        table: boolean;
        total: boolean;
    };
}

type Props = LogCheckInterval | AutoLogChecking | Alert | NavButtons;

export default function getLocalStorage({ key, def }: Props) {
    const str = localStorage.getItem(key)
    if (str !== undefined && str !== null) {
        return JSON.parse(str)
    }
    return def
}
