- [About](#about)
- [Install and Setup](#install-and-setup)
- [Settings](#settings)
- [OBS Overlay for Streamers](#obs-overlay)
- [Updates](#updates)

[На русском](./README.ru.md)

<a name="about"></a>

## About

Electron app for viewing player rankings in Company of Heroes 2/3 matches. Reads the game log file, fetches rankings from the COH API, and optionally displays them as an OBS overlay for streamers.

![alt text](./readmeImages/mainView.png 'main view')

Thanks to <a href="https://github.com/RosboneMako/MakoCelo">Rosbone/MakoCelo</a> for ideas.

<a name="install-and-setup"></a>

## Install and Setup

1. Download the installer from the <a href="https://github.com/sepi4/myCeloJs/releases/latest">latest release</a>
    - **Windows:** .exe installer
    - **Linux:** .deb or .AppImage
2. Install and run
3. Windows may show a warning about an unknown application — click "Run anyway" to proceed
4. Open settings ![alt text](./readmeImages/settingsIcon.png 'settings icon') and select the folder containing `warnings.log` for your game:
    - **COH2:** usually `C:\Users\USERNAME\Documents\my games\company of heroes 2\`
    - **COH3:** usually `C:\Users\USERNAME\Documents\my games\company of heroes 3\`
    - You can set one or both. If only one is set, that game is selected automatically.
5. Test by opening a game in **spectate mode** or starting a game **vs AI**

<a name="settings"></a>

## Settings

**Display**

- **Language** — English or Russian
- **Navbar position** — top, left, or right
- **Font size** — small, medium, or large

**Player identity**

- **Steam ID** — enter your 17-digit Steam ID to show your player card icon on the navbar (COH2 only)

**Navbar controls (on the main screen)**

- **COH2 / COH3 toggle** — switch between games (disabled if that game's log is not set)
- **check log** — manually re-read the log file
- **auto** — automatically re-check the log on an interval (configurable, 1-999 seconds)
- **alert** — play a sound when a new match is detected (when auto-check is on)
- **all** — show all ranked modes in dropdown
- **total** — show total games count
- **table** — display stats in table format

**Views**

- **Team view** — default view showing both teams with expandable player stats
- **Player card** — detailed stats for a single player, with links to external profile sites
- **Search** — find any player by Steam alias or ID

<a name="obs-overlay"></a>

## OBS Overlay for Streamers

After setting a log location, overlay options appear in settings:

1. Select output format and orientation:

    **HTML horizontal:**
    ![alt text](./readmeImages/htmlOutputHorizontal.png 'html horizontal')

    **HTML vertical:**
    ![alt text](./readmeImages/htmlOutput.png 'html vertical')

    **TXT horizontal:**
    ![alt text](./readmeImages/txtOutputHorizontal.png 'txt horizontal')

    **TXT vertical:**
    ![alt text](./readmeImages/txtOutput.png 'txt vertical')

2. Copy the overlay URL by pressing the **Copy** button

    ![alt text](./readmeImages/locationCopied.png 'location copied')

3. Set up in OBS Studio:

    **For HTML format:**
    - In Sources panel, click the + button

        ![alt text](./readmeImages/addSource.png 'add source')

    - Select **Browser**

        ![alt text](./readmeImages/addBrowser.png 'add browser')

    - Paste the copied URL into the URL input
    - Set width and height to your screen resolution

        ![alt text](./readmeImages/sourceSettings.png 'source settings')

    - Resize the source as needed. Test with a game vs AI.

        ![alt text](./readmeImages/resize.png 'resize browser source')

<a name="updates"></a>

## Updates:

- **version 2.3.0.**
    - Font size setting: small, medium, and large options
    - OBS overlay clears automatically when the application closes
    - Fix: navbar defaulting to left position when settings are undefined
    - Fix: search input not responding to font size changes
    - Fix: checkboxes and radio buttons now scale with font size setting
    - Fix: 'games played' text in player tooltip now translates correctly
- **version 2.2.1.**
    - Fix: OBS overlay images not loading in packaged builds
    - Fix: orientation change not updating the HTML overlay
    - Fix: dist scripts now run build before packaging
- **version 2.2.0.**
    - Navbar position setting: left, right, or top
    - Team expand/collapse toggle button
    - Tooltips on sidebar controls and icons
    - Language radio buttons in settings
    - Fix: OBS overlay files (rankings HTML/text) not generated in packaged builds (AppImage/deb/exe)
    - Fix: broken image paths in OBS rankings overlay
    - E2e tests for packaged builds (`npm run e2e:dist`)
- **version 2.1.0.**
    - Separate log inputs for COH2 and COH3
    - Auto-detect COH3 user identity (MY button for both games)
    - COH3 search support
    - Solo rank fallback when team rank is unranked
    - Copy, clear, and reset buttons in settings
    - Russian flag translations, rank total hover tooltip
    - Fix: COH3 rankings display correctly
    - Fix: cross-platform path handling
    - Fix: cleaner list view (stripped unranked suffix, COH3 faction abbreviations)
- **version 2.0.1.**
    - Bug fixes
    - First unit tests
- **version 2.0.0.**
    - Add support for coh3
- **version 1.9.0.**
    - Source code to TS
    - Bug fixes
    - Check log button visible always
    - Expand all teams button
- **version 1.8.1.**
    - Bug fixes
- **version 1.8.0.**
    - Add player card view
    - Add steam id option to settings
    - Add language option in settings
    - Add translations: en, ru
    - Add basic search view
    - Add navbar links to my player card and search
    - Add default web player link option in settings
- **version 1.7.1.**
    - updated links to https://coh2stats.com
- **version 1.7.0.**
    - Add history modal that display history of resent games
    - Add indexes to arranged teams
    - Add sound alert when log checking is in auto mode
- **version 1.6.1.**
    - Bug fix (current user team was some times on wrong positions, should always be first)
    - Small navbar visual changing
- **version 1.6.0.**
    - Manual possibility to check log file
    - Changing interval of auto checking log file
    - Bug fix same players not updating players object (adding time to players object)
- **version 1.5.1.**
    - Small bug fix (in horizontal display, current user team position was some times on wrong side)
- **version 1.5.0.**
    - Add horizontal and vertical rankings display possibility for html/txt
    - User settings should now remain the same after updating app
    - User can skip update version, by pushing 'ignore this version'
    - Little visual updates
- **version 1.4.3.**
    - Add dropdown info sorting possibility by clicking column title
    - Fix nickname width bug
    - Code refactoring and optimization
- **version 1.4.2.**
    - Ranking file is now updating from json file - no flickering
    - Slight visual modification
    - Bug fixing
- **version 1.4.0.**
    - Now in OBS-studio ranking display is possible in html. This will show flag pictures
    - Player ranking can be view in table mode (navbar checkboxes)
    - App is now packed in zip-file. Installation is extraction of this file.
    - Source code: separated React component in to separate files
- **version 1.3.0.**
    - Added rankings display in replays
        - _Rankings can be in some cases incorrect (team games), because log file is not providing information of teams structure. Program is trying to make educated guess of a rankings_
- **version 1.2.0.**
    - Update panel to download updated version of an app.
