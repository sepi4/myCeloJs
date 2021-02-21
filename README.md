<!-- # COH2 LAGGER BUG VERSION
Use <a id="raw-url" href="https://github.com/sepi4/myCeloJs/raw/ladderBug/sepi-celo%20Setup%20666.666.666.exe" > THIS </a> version until relic haven't fixed ladder bugs.  -->

- [About](#about)
- [Install and setup](#install)
- [Установка и настройка](#installRus)
- [Updates](#updates)


<a name="about"></a>

## About

This is electron app for viewing ranks of current connected game of Company of Heroes 2 and display ranks in OBS.

Thanks to <a id="raw-url" href="https://github.com/RosboneMako/MakoCelo">Rosbone/MakoCelo</a> for ideas. It's also rank display for COH2, check it out, maybe you like it better. 




<a name="install"></a>

## Install and setup:

- download zip file (<a id="raw-url" href="https://github.com/sepi4/myCeloJs/releases/latest">latest release</a>)
- extract
- double click 'myCelo.exe'
- allow in firewall if asked *(permission is needed because app is serving ranking.json file to localhost, so that it can read by javascript in ranking.html file every second and update it if needed)*

- in settings ![alt text](./readmeImages/settingsIcon.png "settings icon") select location of 'warnings.log' file (Same folder where are replays saved, usually in "C:\Users\USERNAME\Documents\my games\company of heroes 2\")
- test installation by opening game in SPECTATE MODE or game vs AI.
 <hr>

- **OPTIONAL (for streamers)**, simple way for OBS studio to display ranking:
    - select rankings output  file format and orientations, **html**:
    
        **horizontal**:
    ![alt text](./readmeImages/htmlOutputHorizontal.png "html") 

        **vertical**:
    ![alt text](./readmeImages/htmlOutput.png "html") 

        or **txt**:
        **horizontal**:
    ![alt text](./readmeImages/txtOutputHorizontal.png "html") 

        **vertical**:
    ![alt text](./readmeImages/txtOutput.png "html") 

    - Location can be copied to clipboard by pressing 'copy' button.

        ![alt text](./readmeImages/locationCopied.png "location copied"). 

    - make OBS studio to display rankings file info:
        - for **HTML**:
            - Sources > Add (plus) > Browser 
        
                ![alt text](./readmeImages/plusBrowser.png "+ browser"). 

            - Paste rankings.html file location (copied above) to URL input 
            - Set the same width and height that your display screen resolution is
                ![alt text](./readmeImages/urlPaste.png "url") 

            - Select checkbox 'Refresh browser when scene becomes active' 

                ![alt text](./readmeImages/refreshBrowser.png "refresh browser")

            - Modify size of new window. Test in game vs AI. 



        - for **TXT**:
            - Sources > Add (plus) > Text. 

                ![alt text](./readmeImages/plusText.png "+ text")

            - select checkbox 'read from file' 
            - select location of rankings output file 

                ![alt text](./readmeImages/readFromFile.png "read from file")

            - modify size of output, font, etc.  

<a name="installRus"></a>

## Установка и настройка:

- скачайте zip-файл (<a id="raw-url" href="https://github.com/sepi4/myCeloJs/releases/latest">latest release</a>)
- распакуйте zip-файл
- откройте "myCelo.exe"
- если фаервол попросит разрешения дайте разрешите *(программа использует localhost чтобы rankings.json можно было прочитать с помощью javascript и обновлять rankings.html если это необходимо)*

- в настройках ![alt text](./readmeImages/settingsIcon.png "settings icon") выберите местонахождение 'warnings.log'-файла (тоже место куда сохраняются риплеи, обычно в C:\Users\USERNAME\Documents\my games\company of heroes 2\) 
- проверьте установку в игре против компьютера или в режиме просмотра
<hr>

- **ДЛЯ СТРИМЕРОВ**, отображение рангов на стриме через OBS-studio:
    - выберите формат и ориентацию:    
       **html горизонтально**:
    ![alt text](./readmeImages/htmlOutputHorizontal.png "html") 

       **html вертикально**:
    ![alt text](./readmeImages/htmlOutput.png "html") 

       **txt горизонтально**:
    ![alt text](./readmeImages/txtOutputHorizontal.png "html") 

       **txt вертикально**:
    ![alt text](./readmeImages/txtOutput.png "html") 
    
    - Выберите формат. Скопируйте адрес нажав кнопку 'Copy'.

        ![alt text](./readmeImages/locationCopied.png "location copied")

    - **Настойки в OBS-studio**:
        - для формата **HTML**:
            - Источники > Добавить(плюс) > Браузер 
        
                ![alt text](./readmeImages/plusBrowserRus.png "+ browser"). 

            - вставьте в "Адрес URL" местонахождение файла rankings.html (скопировали из настроек myCelo)
            - вставьте такую же ширину и высоту, что резолюция вашего монитора

                ![alt text](./readmeImages/urlPasteRus.png "url") 

            - поставьте галочку на "Обновить браузер, когда сцена становится активной"
            
                ![alt text](./readmeImages/refreshBrowserRus.png "frame rate")

            - сделайте новое окно подходящего размера и поместите куда хотите на экране

        - для формата **TXT**:
            - Источники > Добавить(плюс) > Текст 
        
                ![alt text](./readmeImages/plusTextRus.png "+ text")

            - поставьте галочку на "чтение из файла" 
            - выберите местонахождение файла (скопировали его из настроек myCelo)

                ![alt text](./readmeImages/readFromFileRus.png "read from file")

            - сделайте новое окно подходящего размера, выберите подходящий фонт и поместите окно куда хотите на экране
            - проверьте установку в игре против компьютера 





<a name="updates"></a>

## Updates:

* **version 1.5.0.** 
    - Add horizontal and vertical rankings display possibility for html/txt
    - User settings should now presist after updating app
    - User can skip update version, by pushing 'ignore this version'
    - Little visual updates
* **version 1.4.3.** 
    - Add dropdown info sorting possibility by clicking column title
    - Fix nickname width bug
    - Code refactoring and optimization 
* **version 1.4.2.** 
    - Ranking file is now updating from json file - no flickering
    - Slight visual modification
    - Bug fixing
* **version 1.4.0.** 
    - Now in OBS-studio ranking display is possible in html. This will show flag pictures
    - Player ranking can be view in table mode (navbar checkboxes)
    - App is now packed in zip-file. Installation is extraction of this file. 
    - Source code: separated React component in to separate files
* **version 1.3.0.** 
    - Added rankings display in replays
        - _Rankings can be in some cases incorrect (team games), because log file is not providing information of teams structure. Program is trying to make educated guess of a rankings_
* **version 1.2.0.** 
    - Update panel to download updated version of an app.
* **version 1.1.0.** 
    - Custom ranking file for OBS can be added now in settings.    
    - Partially works with replays. All ranks can be easily viewed in drop down menu.




