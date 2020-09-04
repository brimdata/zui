

import { exec } from "child_process";

export default function whois(addr: string) {
  return new Promise<any>((resolve, reject) => {
    exec(`whois ${addr}`, (error, stdout, _stderr) => {
      if (error) {
        reject(error.toString());
      } else {
        resolve(stdout);
      }
    });
  });
}