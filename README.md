- [About](#about)
- [Install and Setup](#install-and-setup)
- [Settings](#settings)
- [OBS Overlay for Streamers](#obs-overlay)
- [Changelog](./CHANGELOG.md)

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

See [Changelog](./CHANGELOG.md) for version history.
