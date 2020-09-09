// Type definitions for spectron v3.6.0
// Project: https://github.com/electron/spectron
// Definitions by: deerares <https://github.com/deerares>

/// <reference types="node" />

declare module "spectron" {
  import * as Electron from "electron";
  import * as WebdriverIO from "webdriverio";

  export type SpectronClient = any;
  //   export interface SpectronClient extends WebdriverIO.Client<void> {
  //     /**
  //          * Focus a window using its title or URL.
  //          * <webview> tags can also be focused as a separate window.
  //          */
  //     switchWindow(urlOrTitleToMatch: string): Promise<void>;

  //     /**
  //          * Wait until the window is no longer loading.
  //          * Takes an optional timeout in milliseconds that defaults to 5000.
  //          */
  //     waitUntilWindowLoaded(timeout?: number): Promise<void>;

  //     /**
  //          * Wait until the element matching the given selector contains the given text.
  //          * Takes an optional timeout in milliseconds that defaults to 5000.
  //          */
  //     waitUntilTextExists(
  //       selector: string,
  //       text: string,
  //       timeout?: number,
  //     ): Promise<void>;

  //     /**
  //          * Gets the number of open windows. <webview> tags are also counted as separate windows.
  //          */
  //     getWindowCount(): Promise<number>;
  //     /**
  //          * Focus a window using its index from the windowHandles() array.
  //          * <webview> tags can also be focused as a separate window.
  //          */
  //     windowByIndex(index: number): Promise<void>;
  //     /**
  //          * Get the selected text in the current window.
  //          */
  //     getSelectedText(): Promise<string>;
  //     /**
  //          * Gets the console log output from the render process.
  //          * The logs are cleared after they are returned.
  //          */
  //     getRenderProcessLogs(): Promise<WebdriverIO.LogEntry[]>;
  //     /**
  //          * Gets the console log output from the main process.
  //          * The logs are cleared after they are returned.
  //          */
  //     getMainProcessLogs(): Promise<string[]>;

  //     waitForExist(selector: string): Promise<void>;

  //     waitForVisible(selector: string): Promise<void>;

  //     scroll(selector: string): void;
  //   }

  //   export interface SpectronWindow extends Electron.BrowserWindow {
  //     capturePage(): Promise<Electron.NativeImage>;
  //   }

  export type SpectronWindow = any;

  export interface SpectronWebContents extends Electron.WebContents {
    savePage(
      fullPath: string,
      saveType: "HTMLOnly" | "HTMLComplete" | "MHTML",
      callback?: (eror: Error) => void,
    ): boolean;
    savePage(
      fullPath: string,
      saveType: "HTMLOnly" | "HTMLComplete" | "MHTML",
    ): Promise<void>;
    savePage(
      fullPath: string,
      saveType: "HTMLOnly" | "HTMLComplete" | "MHTML",
    ): any;
    executeJavaScript(code: string, userGesture?: boolean): Promise<any>;
  }

  type BasicAppSettings = {
    /**
         * String host name of the launched chromedriver process. Defaults to 'localhost'.
         */
    host?: string;
    /**
         *  Number port of the launched chromedriver process. Defaults to 9515.
         */
    port?: number;
    /**
         * Number in milliseconds to wait for application quitting.
         * Defaults to 1000 milliseconds.
         */
    quitTimeout?: number;
    /**
         * Number in milliseconds to wait for ChromeDriver to start.
         * Defaults to 5000 milliseconds.
         */
    startTimeout?: number;
    /**
         *  Number in milliseconds to wait for calls like waitUntilTextExists and
         *  waitUntilWindowLoaded to complete.
         *  Defaults to 5000 milliseconds.
         */
    waitTimeout?: number;
    /**
         * Number of retry attempts to make when connecting to ChromeDriver.
         * Defaults to 10 attempts.
         */
    connectionRetryCount?: number;
    /**
         * Number in milliseconds to wait for connections to ChromeDriver to be made.
         * Defaults to 30000 milliseconds.
         */
    connectionRetryTimeout?: number;
    /**
         * String path to a node executable to launch ChromeDriver with.
         * Defaults to process.execPath.
         */
    nodePath?: string;
    /** String path to the Electron application executable to launch.
         * Note: If you want to invoke electron directly with your app's main script then you should
         * specify path as electron via electron-prebuilt and specify your app's main script path as
         * the first argument in the args array.
         */
    path: string;
    /**
         * Array of arguments to pass to the Electron application.
         */
    args?: string[];
    /**
         * Array of arguments to pass to ChromeDriver.
         * See here (https://sites.google.com/a/chromium.org/chromedriver/capabilities) for details
         * on the Chrome arguments.
         */
    chromeDriverArgs?: string[];
    /**
         * Object of additional environment variables to set in the launched application.
         */
    env?: object;
    /**
         *  String address of a Chrome debugger server to connect to.
         */
    debuggerAddress?: string;
    /**
         * String path to file to store ChromeDriver logs in.
         * Setting this option enables --verbose logging when starting ChromeDriver.
         */
    chromeDriverLogPath?: string;
    /**
         * String path to a directory where Webdriver will write logs to.
         * Setting this option enables verbose logging from Webdriver.
         */
    webdriverLogPath?: string;
    /**
         * Extra Webdriver options
         */
    webdriverOptions?: object;
    /**
         * Custom property name to use when requiring modules.
         * Defaults to require.
         * This should only be used if your application deletes the main window.require function
         * and assigns it to another property name on window.
         */
    requireName?: string;
  };
  type AppConstructorOptions = BasicAppSettings & {
    /**
         *  String path to the working directory to use for the launched application.
         *  Defaults to process.cwd().
         */
    cwd?: string;
  };
  export type ApplicationSettings = BasicAppSettings & {
    /**
         *  String path to the working directory to use for the launched application.
         *  Defaults to process.cwd().
         */
    workingDirectory?: string;
  };

  /**
     * Start and stop your Electron application.
     */
  export class Application {
    /**
         * Spectron uses WebdriverIO and exposes the managed client property on the created
         * Application instances.
         * The full client API provided by WebdriverIO can be found here
         * http://webdriver.io/api.html
         * Several additional commands are provided specific to Electron.
         */
    client: SpectronClient;
    /**
         * The electron property is your gateway to accessing the full Electron API.
         * Each Electron module is exposed as a property on the electron property so you can
         * think of it as an alias for require('electron') from within your app.
         */
    electron: Electron.AllElectron;
    /**
         * The browserWindow property is an alias for require('electron').remote.getCurrentWindow().
         * It provides you access to the current BrowserWindow and contains all the APIs.
         * https://electron.atom.io/docs/api/browser-window/
         */
    browserWindow: SpectronWindow;
    /**
         * The webContents property is an alias for
         * require('electron').remote.getCurrentWebContents().
         * It provides you access to the WebContents for the current window
         * and contains all the APIs.
         * https://electron.atom.io/docs/api/web-contents/
         */
    webContents: SpectronWebContents;
    /**
         * The mainProcess property is an alias for require('electron').remote.process.
         * It provides you access to the main process's process global.
         * https://nodejs.org/api/process.html
         */
    mainProcess: NodeJS.Process;
    /**
         *The rendererProcess property is an alias for global.process.
         * It provides you access to the main process's process global.
         * https://nodejs.org/api/process.html
         */
    rendererProcess: NodeJS.Process;

    constructor(options: AppConstructorOptions);

    /**
         * Starts the application.
         * Returns a Promise that will be resolved when the application is ready to use.
         * You should always wait for start to complete before running any commands.
         */
    start(): Promise<Application>;

    /**
         * Stops the application.
         * Returns a Promise that will be resolved once the application has stopped.
         */
    stop(): Promise<Application>;

    /**
         * Stops the application and then starts it.
         * Returns a Promise that will be resolved once the application has started again.
         */
    restart(): Promise<Application>;

    /**
         * Checks to determine if the application is running or not.
         */
    isRunning(): boolean;

    /**
         * Get all the configured options passed to the new Application() constructor.
         * This will include the default options values currently being used.
         */
    getSettings(): ApplicationSettings;
  }
}
