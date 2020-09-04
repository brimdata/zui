
import { BrowserWindow } from "electron";

import { WindowName } from "./windowManager";

export type WindowParams = {
  size: [number, number];
  position?: [number, number];
  query: Object;
  id: string;
};

export default function window(name: WindowName, params: WindowParams) {
  switch (name) {
    case "search":
      return searchWindow(params);
    case "about":
      return aboutWindow();
    case "detail":
      return detailWindow(params);
    default:
      throw new Error(`Unknown window name: ${name}`);

  }
}

function searchWindow(params) {
  let {
    size,
    position,
    query,
    id
  } = params;
  let win = new BrowserWindow({
    titleBarStyle: "hidden",
    resizable: true,
    minWidth: 480,
    minHeight: 100,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true
    }
  }).on("close", e => {
    // Close handled by the search renderer
    e.preventDefault();
    e.sender.webContents.send("close");
  });

  if (size) {
    win.setSize(...size);
  }
  if (position) {
    win.setPosition(...position);
  } else {
    win.center();
  }
  win.loadFile("search.html", { query: { ...query, id } });

  return win;
}

function aboutWindow() {
  let win = new BrowserWindow({
    resizable: false,
    minimizable: false,
    maximizable: false,
    width: 360,
    height: 360,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.setMenu(null);
  win.center();
  win.loadFile("about.html");
  return win;
}

function detailWindow(params) {
  let {
    size,
    position,
    query,
    id
  } = params;
  let win = new BrowserWindow({
    resizable: true,
    width: 360,
    height: 360,
    webPreferences: {
      nodeIntegration: true
    }
  });
  if (size) {
    win.setSize(...size);
  }
  if (position) {
    win.setPosition(...position);
  } else {
    win.center();
  }

  win.loadFile("detail.html", { query: { ...query, id } });

  return win;
}