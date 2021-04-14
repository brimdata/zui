// import brimcap from "src/pkg/brimcap"
// import {file} from "tmp"
// import brim from "../brim"
// import space from "../brim/space"
// import transaction from "../lib/transaction"

// function loadFile(file, space) {
//   return brimcap // promise
//     .load({
//       space,
//       file,
//       progress: trackProgress
//     })
// }

// function trackProgress() {
//   // do someting here
// }

// function isPcap() {}

// // pcap format
// function activate() {
//   brim.importers.add({
//     name: "PCAP Loader",
//     match: isPcap,
//     import: loadFile
//   })
// }

// // default loading
// brim.importers.add({
//   name: "Default Loader",
//   match: () => true,
//   import: ({files, space, progress}) => {
//     await brim.backend.post(file, space)
//     progress(0.5)
//   }
// })

// const importer = brim.importers.matching(file)
