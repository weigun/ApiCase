const gettype = Object.prototype.toString

export const utils = {
  is_obj: function (o) {

    return gettype.call(o) == "[object Object]";

  },

  is_array: function (o) {

    return gettype.call(o) == "[object Array]";

  },

  is_null: function (o) {

    return gettype.call(o) == "[object Null]";
  },
  is_number: function (o) {

    return gettype.call(o) == "[object Number]";
  },
  is_string: function (o) {

    return gettype.call(o) == "[object String]";
  },
  is_bool: function (o) {
    return gettype.call(o) == "[object Boolean]";
  },
}

