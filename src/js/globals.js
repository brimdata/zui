global.inspect = (object, label = null) => {
  if (label) console.log(label, object)
  else console.log(object)
  return object
}
