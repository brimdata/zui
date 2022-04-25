import {app as mockApp} from "electron"
export const app = mockApp

export const dialog = {
  showMessageBox: jest.fn(),
}
