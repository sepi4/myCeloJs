interface Translations {
    [key: string]: {
        en: string
        ru: string
    }
}

const text: Translations = {
    // settings ---------------------------------
    log_location_title: {
        en: 'Log location',
        ru: 'Расположение лог-файла',
    },
    select: {
        en: 'select',
        ru: 'выбрать',
    },

    rankings_file_title: {
        en: 'Rankings file (for OBS-studio)',
        ru: 'Файл рангов (для OBS-studio)',
    },
    format: {
        en: 'format',
        ru: 'формат',
    },
    orientation: {
        en: 'orientation',
        ru: 'ориентация',
    },
    horizontal: {
        en: 'horizontal',
        ru: 'горизонтально',
    },
    vertical: {
        en: 'vertical',
        ru: 'вертикально',
    },
    copy: {
        en: 'copy',
        ru: 'копировать',
    },
    copied: {
        en: 'copied',
        ru: 'скопировано',
    },

    settings_file_location_title: {
        en: 'Settings file location',
        ru: 'Расположение файла настроек',
    },

    language: {
        en: 'Language',
        ru: 'Язык',
    },

    log_location_first: {
        en: 'Add log location file first',
        ru: 'Надо сначала указать расположение лог-файла',
    },

    my_steam_id: {
        en: 'My steam id',
        ru: 'Мой steam id',
    },
    save: {
        en: 'save',
        ru: 'сохранить',
    },
    id_is_wrong: {
        en: 'ID is wrong',
        ru: 'неправильный ID',
    },

    required: {
        en: 'required',
        ru: 'обязательно',
    },
    required_for_coh2: {
        en: 'Required for COH2',
        ru: 'Обязательно для COH2',
    },
    required_for_coh3: {
        en: 'Required for COH3',
        ru: 'Обязательно для COH3',
    },
    id_set: {
        en: 'ID set',
        ru: 'ID установлен',
    },
    reset_all_settings: {
        en: 'Remove all settings',
        ru: 'Удалить все настройки',
    },
    reset_all_settings_confirm: {
        en: 'Remove all settings?',
        ru: 'Удалить все настройки?',
    },
    cancel: {
        en: 'cancel',
        ru: 'отмена',
    },
    ok: {
        en: 'ok',
        ru: 'ок',
    },
    clear_log_location: {
        en: 'Clear log location',
        ru: 'Очистить путь к лог-файлу',
    },
    clear_steam_id: {
        en: 'Clear steam id',
        ru: 'Очистить steam id',
    },

    // navbar  ---------------------------------

    tooltip_all: {
        en: 'Show all ranked modes in dropdown',
        ru: 'Показать все режимы в раскрывающемся меню',
    },
    tooltip_total: {
        en: 'Show total games count',
        ru: 'Показать общее количество игр',
    },
    tooltip_table: {
        en: 'Show stats as a table',
        ru: 'Показать статистику в виде таблицы',
    },
    tooltip_auto: {
        en: 'Automatically re-check log on interval',
        ru: 'Автоматически проверять лог через интервал',
    },
    tooltip_interval: {
        en: 'Interval in seconds between log checks',
        ru: 'Интервал в секундах между проверками лога',
    },
    tooltip_alert: {
        en: 'Play a sound when a new match is detected',
        ru: 'Воспроизводить звук при обнаружении нового матча',
    },

    game: {
        en: 'game',
        ru: 'игра',
    },
    table: {
        en: 'table',
        ru: 'таблица',
    },
    all: {
        en: 'all',
        ru: 'все',
    },
    total: {
        en: 'total',
        ru: 'количество игр',
    },

    auto: {
        en: 'auto',
        ru: 'авто',
    },
    sec: {
        en: 'sec',
        ru: 'сек',
    },
    alert: {
        en: 'alert',
        ru: 'звонок',
    },
    check_log_button: {
        en: 'check log',
        ru: 'проверить',
    },
    integer_error: {
        en: 'integer 1-999',
        ru: 'целое число 1-999',
    },
    my_playercard: {
        en: 'my playercard',
        ru: 'моя карта игрока',
    },
    search: {
        en: 'search',
        ru: 'поиск',
    },
    settings: {
        en: 'settings',
        ru: 'настройки',
    },
    log_not_set: {
        en: 'Game log file is not set',
        ru: 'Лог-файл игры не указан',
    },

    // dropdown menu  ---------------------------------
    of: {
        en: 'of',
        ru: 'из',
    },
    expand_all: {
        en: 'expand all',
        ru: 'открыть все',
    },
    rank: {
        en: 'rank',
        ru: 'ранг',
    },
    mode: {
        en: 'mode',
        ru: 'мод',
    },
    win: {
        en: 'win %',
        ru: 'победы %',
    },
    streak: {
        en: 'streak',
        ru: 'серия',
    },
    fetch_history: {
        en: 'fetch game history',
        ru: 'загрузить историю игр',
    },
    total_games: {
        en: 'total games',
        ru: 'количество игр',
    },
    team_of: {
        en: 'team',
        ru: 'команда',
    },

    // history ---------------------------------
    game_start_time: {
        en: 'game start time',
        ru: 'время начала игры',
    },
    game_end_time: {
        en: 'game end time',
        ru: 'время конца игры',
    },
    map: {
        en: 'map',
        ru: 'карта',
    },
    duration: {
        en: 'duration',
        ru: 'продолжительность',
    },

    faction: {
        en: 'faction',
        ru: 'фракция',
    },
    name: {
        en: 'name',
        ru: 'имя',
    },

    // history keys
    dmgdone: {
        en: 'damage',
        ru: 'урон',
    },
    edeaths: {
        en: 'losts',
        ru: 'потери',
    },
    ekills: {
        en: 'kills',
        ru: 'убийства',
    },
    sqlost: {
        en: 'squad lost',
        ru: 'отрядов потеряно',
    },
    sqkilled: {
        en: 'squad killed',
        ru: 'отрядов убито',
    },
    pcap: {
        en: 'point cap',
        ru: 'точек захвачено',
    },
    vkill: {
        en: 'vehicle kills',
        ru: 'техники убито',
    },
    vlost: {
        en: 'vehicle losts',
        ru: 'техники потеряно',
    },

    // main view ---------------------------------
    no_info: {
        en: 'Watching log file — no match found yet',
        ru: 'Слежу за лог-файлом — матч ещё не найден',
    },
    add_log_location: {
        en: 'Open settings and set the log file location (warnings.log)',
        ru: 'Откройте настройки и укажите расположение лог-файла (warnings.log)',
    },

    // update bar
    update_to_version: {
        en: 'update to version',
        ru: 'обновить на версию',
    },
    download: {
        en: 'download',
        ru: 'скачать',
    },
    copy_link: {
        en: 'copy link',
        ru: 'скопировать ссылку',
    },
    skip_this_version: {
        en: 'skip this version',
        ru: 'пропустить эту версию',
    },

    // search
    steam_alias_or_id: {
        en: 'steam alias or id',
        ru: 'ник или ID стима',
    },
    mp_games: {
        en: 'total games',
        ru: 'количество игр',
    },
    last_game: {
        en: 'last game',
        ru: 'последняя игра',
    },
}

export default text
