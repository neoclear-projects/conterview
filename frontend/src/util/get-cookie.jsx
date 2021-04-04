export function getCookie(key: string) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

export function hasCookie(key: string) {
  var b = document.cookie.indexOf(key);
  return b !== -1;
}