export default [
  "_path=='conn' | count() by duration, uid",
  "_path=='conn' | count() by duration",
  "_path=='conn'",
  "* | count() by id.orig_h",
  "* | count() by this['myfield is here']",
  "* | sort _path",
  "* | sort -r query, duration",
  "* | sort -r query",
  "* | sort -r",
  "* | sort query, duration",
  "* | sort this",
  "* | sort",
  "*",
  "count() by typeof(this['my fav field'])"
]
