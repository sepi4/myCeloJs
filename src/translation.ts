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

    web_link: {
        en: 'Site for player links',
        ru: 'Сайт для ссылки игрока',
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
    id_set: {
        en: 'ID set',
        ru: 'ID установлен',
    },

    // navbar  ---------------------------------

    game: {
        en: 'game',
        ru: 'игра',
    },
    dropdown_info: {
        en: 'dropdown info',
        ru: 'раскрывающаяся инфо',
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

    log_checking: {
        en: 'log checking',
        ru: 'проверка лог-файла',
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

    // dropdown menu  ---------------------------------
    of: {
        en: 'of',
        ru: 'из',
    },
    expand_all: {
        en: 'expand all',
        ru: 'открыть все',
    },
    close_all: {
        en: 'close all',
        ru: 'закрыть все',
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
    total_dropdown: {
        en: 'total',
        ru: 'всего',
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
    Allies: {
        en: '✰',
        ru: '✰',
    },
    Axis: {
        en: '✚',
        ru: '✚',
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
        en: 'no game info in log file',
        ru: 'нет информации об игре в лог-файле',
    },
    add_log_location: {
        en: 'Please, in settings specify location log file (warnings.log)',
        ru: 'Укажите в настройках расположение лог-файла (warnings.log)',
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
