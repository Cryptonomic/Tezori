export default function request(url, method, body) {
  return fetch(url, {
    method: method.toUpperCase(),
    ...(method.toLowerCase() === 'post' && { body }),
  })
}
