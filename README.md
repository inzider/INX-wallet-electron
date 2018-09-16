# Welcome to the INX-wallet-electron wiki!
This is raw notes. I will make a cleaner Wiki when the new wallet is more advanced.


***


### Intro
I will try to explain the logic I had when I first started this repo.  
We came to choose Electron & AngularJS to make the desktop GUI Wallet.  
We use two wrapper to help the use of the daemon and wallet daemon.  
[INX-daemon-nodejs-wrapper](https://github.com/InziderX/INX-daemon-nodejs-wrapper) & [INX-wallet-nodejs-wrapper](https://github.com/InziderX/INX-wallet-nodejs-wrapper)  
1. When the Electron app starts, it will check for a new version of the GUI online.  
If there is a new version we download & self-update.  
2. Search for the GUI wallet config file into the user home directory.  
If there is no config file, we show the firstUse screen and wait for the user to save.  
The GUI wallet config file is created and loaded, all wallet directories are created.  
3. Search for the build files into wallet home directory.  
If no build are found or are out-dated, we download the latest builds from the git releases.  
4. Search for the Daemon config file into the home folders.  
If not daemon config file is found we download it from the git repo.  
5. The daemon is starting, we wait until synchronized.  
6. Check the GUI wallet config file to see last opened wallet file and try to open that same wallet again  
If no last opened wallet file is found we show the wallet selection screen and wait until a wallet is chosen.  
If the wallet is password protected we show the password screen.
We also have the option to create a new wallet at this point.  
7. We are loaded into a wallet, the wallet start synchronizing with the daemon and balance become available.  

***


### Screens
When a screen is active, it will overlay over the main content.  
There's many screens for many situations:
* _firstUse_ : First use screen appear when no GUI Wallet config file has been found. This is the first setup screen and will generate the GUI Wallet config file once completed.
* _started_ : Started screen appears when the blockchain is initializing.
* _stopped_ : Stopped screen appears when the daemon has stopped.
* _syncing_ : Syncing screen appears when the blockchain is syncing.
* _network_ : Network screen appears when no internet connection is available.
* _password_ : Password screen appears when we attempt to open an encrypted wallet.
* _update_ : Update screen appears when there is a GUI, build and config file update.
* _wallets_ : Wallets screen appears when we want to choose a wallet.
* _create_ : Create screen appears when we want to create a new wallet.
* _..._


***


### Pages
When no screens are shown the main layout will be available.  
* _Balance_ : Page shows available, locked, total balance of the opened wallet. Also shows the 5 last transactions.
* _Send_ : Page to send coins to an address or contact.
* _Transactions_ : Page shows a table of all transactions related to the opened wallet.
* _View Transaction_ : Page shows all details about a selected transaction hash.
* _Block Explorer_ : Page shows a table of the latest blocks in the blockchain. Also shows search tools.
* _View Block_ : Page shows all details about a selected block hash.
* _My Contacts_ : Page to manager opened wallet contacts. Contacts are encrypted with the same password as the wallet.
* _Pool Mining_ : Page shows a list of available mining pools.
* _Settings_ : Page to manage the opened wallet settings and general settings.
