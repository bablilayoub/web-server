const { app, BrowserWindow, ipcMain, dialog } = require("electron/main");
const path = require("node:path");
const config = require("./system/config");
const { exec } = require("child_process");
const os = require("os");
const { execSync } = require("node:child_process");
const { shell } = require("electron");
const fs = require("fs");

// Store
const Store = require('electron-store');

// New instance of store
const store = new Store();

// Debug mode
const debug = config.debug;

const platform = os.platform();

// Paths
const views_path = path.join(__dirname, "views");
const system_path = path.join(__dirname, "system");

// Load view file
const view = (file) => {
  return path.join(views_path, file + ".html");
};

// Load system file
const system = (file) => {
  return path.join(system_path, file + ".js");
};

// Window
let window = null;

const new_window = (template, data) => {
  try {
    // if window is already open, close it
    if (window) {
      window.close();
    }

    // create new window
    window = new BrowserWindow({
      width: data?.width || 800,
      height: data?.height || 667,
      //frame: false, // disable frame
      resizable: false, // disable resizing
      webPreferences: {
        nodeIntegration: true, // turn off node integration
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        preload: system("preload"), // use preload.js
      },
    });

    // enable debug mode if true
    if (debug) {
      window.webContents.openDevTools();
    }

    // load the file
    window.loadFile(view(template));
  } catch (error) {
    // log the error if debug mode is enabled
    if (debug) {
      console.log(error);
    }
  }
};

// Create new window when app is ready
app.whenReady().then(() => {
  new_window(config.default_page);
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  app.quit();
});

// Create new window when app is activated and no windows are open
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    new_window(config.default_page);
  }
});

// Handle brew
const handleBrew = async () => {
  try {
    // Check if brew is installed
    exec("brew -v", (error, stdout, stderr) => {
      if (error) {
        // Download brew
        exec(
          '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
          (error, stdout, stderr) => {
            if (error) {
              // Log the error if debug mode is enabled
              if (debug) {
                console.log(error);
              }
              return false;
            }
          }
        );
      }
    });
    return true;
  } catch (error) {
    // Log the error if debug mode is enabled
    if (debug) {
      console.log(error);
    }
    return false;
  }
};

//  Handle php
const handlePhp = async (version) => {
  try {
    // Check if php is installed
    exec(`php -v`, (error, stdout, stderr) => {
      if (error) {
        // Install php
        exec(`brew install php@${version}`, (error, stdout, stderr) => {
          if (error) {
            // Log the error if debug mode is enabled
            if (debug) {
              console.log(error);
            }
            return false;
          }
        });
      }
    });
    return true;
  } catch (error) {
    // Log the error if debug mode is enabled
    if (debug) {
      console.log(error);
    }
    return false;
  }
};

// Handle database
const handleDatabase = async (server) => {
  try {
    // Check if database server is installed
    exec(`${server} --version`, (error, stdout, stderr) => {
      if (error) {
        // Install database server
        exec(`brew install ${server}`, (error, stdout, stderr) => {
          if (error) {
            // Log the error if debug mode is enabled
            if (debug) {
              console.log(error);
            }
            return false;
          }
        });
      }
    });
    return true;
  } catch (error) {
    // Log the error if debug mode is enabled
    if (debug) {
      console.log(error);
    }
    return false;
  }
};

// Run server
const runServer = async (phpVersion, databaseServer, serverPath, serverPort) => {
  try {
    // Start php if not running
    if (!fs.existsSync(serverPath)) {
      // Log the error if debug mode is enabled
      if (debug) {
        console.log("Server path does not exist");
      }
      return false;
    }

    // Start php server
    exec(`php -S localhost:${serverPort} -t ${serverPath}`, (error, stdout, stderr) => {
      if (error) {
        // Log the error if debug mode is enabled
        if (debug) {
          console.log(error);
        }
        return false;
      }
    });

    // Start database server if not running
    if (databaseServer === "mysql") {
      // Check if mysql is running
      exec(`mysql.server status`, (error, stdout, stderr) => {
        if (error) {
          // Start mysql
          exec(`mysql.server start`, (error, stdout, stderr) => {
            if (error) {
              // Log the error if debug mode is enabled
              if (debug) {
                console.log(error);
              }
              return false;
            }
          });
        }
      }
      );
    }
    return true;
  }
  catch (error) {
    // Log the error if debug mode is enabled
    if (debug) {
      console.log(error);
    }
    return false;
  }
};

// open-folder-dialog
ipcMain.on("open-folder-dialog", async (event) => {
  dialog.showOpenDialog({
      properties: ['openDirectory']
  }).then(result => {
      const selectedFolderPaths = result.filePaths;
      if (!result.canceled && selectedFolderPaths.length > 0) {
          event.reply('selected-folder', selectedFolderPaths[0]);
      }
  }).catch(err => {
      console.log(err);
  });
});


// Start server
ipcMain.on("start-server", async (event, data) => {
  // Get php version
  const phpVersion = data.phpVersion;

  // Get database server
  const databaseServer = data.databaseServer;

  // Check if php version is set
  if (phpVersion === "") {
    // Send IpcRenderer message to display error
    window.webContents.send("start-server-error", "Please select a PHP version");
    return;
  }

  // Check if database server is set
  if (databaseServer === "") {
    // Send IpcRenderer message to display error
    window.webContents.send("start-server-error", "Please select a Database server");
    return;
  }

  // Check if brew is installed
  if (debug) {
    console.log("Checking brew...");
  }

  // Handle brew
  const brew = await handleBrew();
  if (!brew) {
    // Send IpcRenderer message to display error
    window.webContents.send("start-server-error", "Something went wrong, please try again");
    return;
  }

  // Check if php is installed
  if (debug) {
    console.log("Checking php...");
  }

  // Handle php
  const php = await handlePhp(phpVersion);
  if (!php) {
    // Send IpcRenderer message to display error
    window.webContents.send("start-server-error", "Something went wrong, please try again");
    return;
  }

  // Check if database server is installed
  if (debug) {
    console.log("Checking database server...");
  }

  // Handle database
  const database = await handleDatabase(databaseServer);
  if (!database) {
    // Send IpcRenderer message to display error
    window.webContents.send("start-server-error", "Something went wrong, please try again");
    return;
  }

  // Run server
  if (debug) {
    console.log("Running server...");
  }

  // Run server
  const server = await runServer(phpVersion, databaseServer, data.serverPath, data.serverPort);
  if (!server) {
    // Send IpcRenderer message to display error
    window.webContents.send("start-server-error", "Something went wrong, please try again");
    return;
  }

  // Open the default browser
  setTimeout(() => {
    shell.openExternal(`http://localhost:${data.serverPort}`);
  }, 2000);

  // Send IpcRenderer message to display success
  window.webContents.send("start-server-success", "Server started successfully");
});

// Quit app
ipcMain.on("quit-app", async (event, data) => {
  app.quit();
});

// Save config
ipcMain.on("save-config", async (event, data) => {
  // Save the data
  store.set("config", data);

  // Send IpcRenderer message to display success
  window.webContents.send("save-config-success", "Configuration saved successfully");
});