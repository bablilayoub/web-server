// Use strict mode
"use strict";

// Custom Toast
const toast = (type, message, position = "bottom-right", duration = 3000) => {
    // check if toast already exists
    if (document.querySelector(".toast")) {
        // Get all toasts and loop through them and remove toast with same position
        let toasts = document.querySelectorAll(".toast");
        for (let i = 0; i < toasts.length; i++) {
            if (toasts[i].classList.contains("position-" + position)) {
                toasts[i].remove();
            }
        }
    }

    // create toast div
    let toast = document.createElement("div");
    toast.classList.add("toast", "fixed", "rounded-lg", "p-3", "flex", "items-center",
        "justify-between", "shadow-lg", "max-w-sm", "transition", "duration-500", "ease-in-out",
        "transform", "opacity-0", "scale-50", "text-normal", "z-50", "h-12", 'font-medium', 'text-white');

    // append toast to body
    document.body.appendChild(toast);

    // set toast message
    toast.innerHTML = message;

    // set toast background color
    switch (type) {
        case "success":
            toast.classList.add("bg-success");
            break;
        case "error":
            toast.classList.add("bg-error");
            break;
        case "warning":
            toast.classList.add("bg-warning");
            break;
        case "info":
            toast.classList.add("bg-info");
            break;
        default:
            toast.classList.add("bg-primary");
    }

    // set toast position
    switch (position) {
        case "top-right":
            toast.classList.add("top-5", "right-5", "position-top-right");
            break;
        case "top-left":
            toast.classList.add("top-5", "left-5", "position-top-left");
            break;
        case "top-center":
            toast.classList.add("top-5", "left-1/2", "transform", "-translate-x-1/2", "position-top-center");
            break;
        case "bottom-left":
            toast.classList.add("bottom-5", "left-5", "position-bottom-left");
            break;
        case "bottom-right":
            toast.classList.add("bottom-5", "right-5", "position-bottom-right");
            break;
        case "bottom-center":
            toast.classList.add("bottom-5", "left-1/2", "transform", "-translate-x-1/2", "position-bottom-center");
            break;
        case "center":
            toast.classList.add("top-1/2", "left-1/2", "transform", "-translate-x-1/2", "-translate-y-1/2", "position-center");
            break;
        case "center-left":
            toast.classList.add("top-1/2", "left-5", "transform", "-translate-y-1/2", "position-center-left");
            break;
        case "center-right":
            toast.classList.add("top-1/2", "right-5", "transform", "-translate-y-1/2", "position-center-right");
            break;
        default:
            toast.classList.add("bottom-5", "right-5", "position-bottom-right");
    }

    // show toast
    setTimeout(() => {
        toast.classList.remove("opacity-0", "scale-50");
        toast.classList.add("opacity-100", "scale-100");
    }, 100);

    // hide toast
    setTimeout(() => {
        toast.classList.remove("opacity-100", "scale-100");
        toast.classList.add("opacity-0", "scale-50");
    }, duration);

    // remove toast
    setTimeout(() => {
        toast.remove();
    }, duration + 500);
}

// Set page name based on slug
const setPageName = (name) => {
	const slug = document.querySelector("meta[name='page-slug']").getAttribute("content");
	if (slug === "main")
		document.title = name;
	else
		document.title = "404";
}

// Set title where id of the element is "title"
const setTitle = (title) => {
	// Loop through all elements with the id "title"
	document.querySelectorAll("#title").forEach((element) => {
		// Set the title
		element.innerHTML = title;
	});	
}

// Set version where id of the element is "version"
const setVersion = (version) => {
	// Loop through all elements with the id "version"
	document.querySelectorAll("#version").forEach((element) => {
		// Set the version
		element.innerHTML = "Version : " + version;
	});
}

// Open folder dialog
const openFolderDialog = (returnValueToId) => {
    // Send IpcRenderer message to open folder dialog
    ipcRenderer.send("open-folder-dialog");

    // On IpcRenderer reply
    ipcRenderer.on("selected-folder", (data) => {
        // Set the value of the input field
        document.querySelector("#" + returnValueToId).value = data;
    });
}

// Keep listening if something is changed
const listenForChanges = () => {
    // Get config tooltip
    const configTooltip = document.querySelector("#config-tooltip");

    // Get save config button
    const saveConfig = document.querySelector("#save-config");

	// Get php version
	const phpVersion = document.querySelector("#php-version");

	// Get database server
	const databaseServer = document.querySelector("#database-server");

    // Get server path
    const serverPath = document.querySelector("#server-path");

    // Get server port
    const serverPort = document.querySelector("#server-port");

    // Listen for changes
    phpVersion.addEventListener("change", () => {
        // Change the tooltip text by changing data-tip
        configTooltip.setAttribute("data-tip", "Save config");

        // Change button innerHTML (svg icon)
        saveConfig.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" /><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M14 4l0 4l-6 0l0 -4" /></svg>';
 
        // Enable the save config button
        saveConfig.disabled = false;
    });

    databaseServer.addEventListener("change", () => {
        // Change the tooltip text by changing data-tip
        configTooltip.setAttribute("data-tip", "Save congfig");

        // Enable the save config button
        saveConfig.disabled = false;
    });

    serverPath.addEventListener("input", () => {
        // Change the tooltip text by changing data-tip
        configTooltip.setAttribute("data-tip", "Save congfig");

        // Enable the save config button
        saveConfig.disabled = false;
    });

    serverPort.addEventListener("input", () => {
        // Change the tooltip text by changing data-tip
        configTooltip.setAttribute("data-tip", "Save congfig");

        // Enable the save config button
        saveConfig.disabled = false;
    });

    saveConfig.addEventListener("click", () => {
        // Get php version
        const phpVersion = document.querySelector("#php-version").value;

        // Get database server
        const databaseServer = document.querySelector("#database-server").value;

        // Get server path
        const serverPath = document.querySelector("#server-path").value;

        // Get server port
        const serverPort = document.querySelector("#server-port").value;

        // Send IpcRenderer message to save config
        ipcRenderer.send("save-config", { phpVersion, databaseServer, serverPath, serverPort });

        // Change the tooltip text by changing data-tip
        configTooltip.setAttribute("data-tip", "Config saved");

        // Change button innerHTML (svg icon)
        saveConfig.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" /><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M14 4l0 4l-6 0l0 -4" /></svg>';

        // Disable the save config button
        saveConfig.disabled = true;
    });
}

// Star server function
document.querySelector("#run-server").addEventListener("click", () => {
	// Get run server button
	const runServer = document.querySelector("#run-server");

	// Get php version
	const phpVersion = document.querySelector("#php-version").value;

	// Get database server
	const databaseServer = document.querySelector("#database-server").value;

    // Get server path
    const serverPath = document.querySelector("#server-path").value;

    // Get server port
    const serverPort = document.querySelector("#server-port").value;

    // Validate data
    if (phpVersion === "") {
        toast("error", "Please select a PHP version", "top-center", 5000);
        return;
    }

    if (databaseServer === "") {
        toast("error", "Please select a Database server", "top-center", 5000);
        return;
    }

    if (serverPath === "") {
        toast("error", "Server path is required", "top-center", 5000);
        return;
    }

    if (serverPort === "") {
        toast("error", "Server port is required", "top-center", 5000);
        return;
    }

	// Disable the button
	runServer.disabled = true;

	// Change the button text
	runServer.innerHTML = "Starting...";

	// Send IpcRenderer message to start the server
	ipcRenderer.send("start-server", { phpVersion, databaseServer, serverPath, serverPort });
});

// Get page slug
const pageSlug = document.querySelector("meta[name='page-slug']").getAttribute("content");

if (pageSlug === "main") {
    // Get saved config
    const savedConfig = store.get("config");

    if (savedConfig.phpVersion !== "") {
        document.querySelector("#php-version").value = savedConfig.phpVersion;
    }

    if (savedConfig.databaseServer !== "") {
        document.querySelector("#database-server").value = savedConfig.databaseServer;
    }

    if (savedConfig.serverPath !== "") {
        document.querySelector("#server-path").value = savedConfig.serverPath;
    }

    if (savedConfig.serverPort !== "") {
        document.querySelector("#server-port").value = savedConfig.serverPort;
    }
}

// On ipcRenderer start-server-error
ipcRenderer.on("start-server-error", (data) => {
	toast("error", data, "top-center", 5000);
	document.querySelector("#run-server").disabled = false;
	document.querySelector("#run-server").innerHTML = "Start Server";
});

// On ipcRenderer start-server-success
ipcRenderer.on("start-server-success", (data) => {
	toast("success", data, "top-center", 5000);
	document.querySelector("#run-server").disabled = false;
	document.querySelector("#run-server").innerHTML = "Start Server";
});

// On ipcRenderer save-config-success
ipcRenderer.on("save-config-success", (data) => {
    toast("success", data, "top-center", 5000);
});

// Quit app
const quitApp = () => {
    // Send IpcRenderer message to quit app
    ipcRenderer.send("quit-app");
}

// Run the functions
setPageName(config.app_name);
setVersion(config.version);
setTitle(document.title);
listenForChanges();