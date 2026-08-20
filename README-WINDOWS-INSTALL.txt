JARVIS AI - WINDOWS INSTALLER 1.12.6
===================================

This package does not contain the previous broken JARVIS_Setup.exe.

For a genuine standard EXE or MSI, run BUILD_WINDOWS_INSTALLERS.bat from the
complete project. See BUILDING-EXE-MSI.md for instructions. The BAT/PWA method
below remains the smallest option and does not need to download Electron.

IMPORTANT
Native Windows Settings, Control Panel, and installed-app launch commands require
the genuine version 1.12.6 EXE/MSI. The BAT/PWA method remains web-sandboxed and
cannot open local installed programs.

Version 1.12.6 keeps every previous JARVIS function and adds the controlled
Knowledge Update Agent. Internet findings require two source domains, Generator
and Critic checks, and your explicit approval before they enter synchronized RAG.
It keeps the visible confirmation after an automatic update. Install v1.10.0 or later once, then configure the release channel with
CONFIGURE_WINDOWS_AUTO_UPDATE.bat. Future verified native releases download in
the background and install when JARVIS closes.

INSTALL
1. Right-click the ZIP and choose Extract All.
2. Open the extracted JARVIS_WINDOWS_INSTALLER folder.
3. Double-click INSTALL_JARVIS_WINDOWS_APP.bat.
4. Paste the complete HTTPS address of your deployed JARVIS website.
5. Start JARVIS AI from the Desktop or Start Menu.

Do not run the BAT file while it is still inside the ZIP. Keep the assets and
windows-app folders beside it during installation. Administrator permission is
not required. Microsoft Edge or Google Chrome is required.

BROWSER-NATIVE ALTERNATIVE
Open your JARVIS website in Microsoft Edge. Select the three-dot menu, Apps,
then Install this site as an app. In Chrome, use Save and share, then Install
page as app. This is the best option when a company-managed PC blocks scripts.

UNINSTALL
Double-click UNINSTALL_JARVIS_WINDOWS_APP.bat, use the JARVIS Start Menu
uninstaller, or open Windows Settings, Apps, Installed apps, JARVIS AI.

Uninstalling the Windows app does not delete your Cloudflare deployment or
synchronized JARVIS data.
