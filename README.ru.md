- [О программе](#about)
- [Установка и настройка](#install)
- [Настройки](#settings)
- [OBS оверлей для стримеров](#obs-overlay)

[English version](./README.md)

<a name="about"></a>

## О программе

Приложение для просмотра рангов игроков в матчах Company of Heroes 2/3. Считывает лог-файл игры, получает ранги из API COH и может отображать их как оверлей в OBS для стримеров.

![alt text](./readmeImages/mainView.png 'main view')

Спасибо <a href="https://github.com/RosboneMako/MakoCelo">Rosbone/MakoCelo</a> за идеи.

<a name="install"></a>

## Установка и настройка

1. Скачайте установщик из <a href="https://github.com/sepi4/myCeloJs/releases/latest">последнего релиза</a>
    - **Windows:** .exe установщик
    - **Linux:** .deb или .AppImage
2. Установите и запустите
3. Windows может показать предупреждение о неизвестном приложении — нажмите "Всё равно запустить"
4. Откройте настройки ![alt text](./readmeImages/settingsIcon.png 'settings icon') и выберите папку с файлом `warnings.log` для вашей игры:
    - **COH2:** обычно `C:\Users\USERNAME\Documents\my games\company of heroes 2\`
    - **COH3:** обычно `C:\Users\USERNAME\Documents\my games\company of heroes 3\`
    - Можно указать одну или обе. Если указана только одна, игра выбирается автоматически.
5. Проверьте, запустив игру в **режиме наблюдения** или **против ИИ**

<a name="settings"></a>

## Настройки

**Отображение**

- **Язык** — английский или русский
- **Позиция панели навигации** — сверху, слева или справа
- **Размер шрифта** — маленький, средний или большой

**Идентификация игрока**

- **Steam ID** — введите ваш 17-значный Steam ID, чтобы иконка вашей карточки игрока появилась на панели навигации (только для COH2)

**Элементы управления на панели навигации (на главном экране)**

- **Переключатель COH2 / COH3** — переключение между играми (неактивно, если лог для игры не указан)
- **проверить** (check log) — вручную перечитать лог-файл
- **авто** (auto) — автоматически перечитывать лог через заданный интервал (1–999 секунд)
- **звонок** (alert) — звуковой сигнал при обнаружении нового матча (при включённом авто)
- **все** (all) — показать все ранговые режимы в выпадающем меню
- **количество** (total) — показать общее количество игр
- **таблица** (table) — отображение статистики в виде таблицы

**Виды**

- **Командный вид** — вид по умолчанию, показывает обе команды с раскрываемой статистикой игроков
- **Карточка игрока** — подробная статистика игрока со ссылками на внешние профили
- **Поиск** — найти любого игрока по нику Steam или ID

<a name="obs-overlay"></a>

## OBS оверлей для стримеров

После указания расположения лог-файла, опции оверлея станут доступны в настройках:

1. Выберите формат и ориентацию:

    **HTML горизонтально:**
    ![alt text](./readmeImages/htmlOutputHorizontal.png 'html horizontal')

    **HTML вертикально:**
    ![alt text](./readmeImages/htmlOutput.png 'html vertical')

    **TXT горизонтально:**
    ![alt text](./readmeImages/txtOutputHorizontal.png 'txt horizontal')

    **TXT вертикально:**
    ![alt text](./readmeImages/txtOutput.png 'txt vertical')

2. Скопируйте URL оверлея, нажав кнопку **Copy**

    ![alt text](./readmeImages/locationCopied.png 'location copied')

3. Настройка в OBS Studio:

    **Для формата HTML:**
    - В панели "Источники" нажмите кнопку +

        ![alt text](./readmeImages/addSource.png 'add source')

    - Выберите **Браузер**

        ![alt text](./readmeImages/addBrowser.png 'add browser')

    - Вставьте скопированный URL в поле URL
    - Установите ширину и высоту равными разрешению вашего экрана

        ![alt text](./readmeImages/sourceSettings.png 'source settings')

    - Измените размер источника по необходимости. Проверьте в игре против ИИ.

        ![alt text](./readmeImages/resize.png 'resize browser source')
