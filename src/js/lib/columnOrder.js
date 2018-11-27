const EXCLUDED = ["ts", "_td"]

export default cols => {
  const orderedCols = cols.filter(name => !EXCLUDED.includes(name))
  if (cols.includes("ts")) {
    return ["ts", ...orderedCols]
  } else {
    return orderedCols
  }
}
