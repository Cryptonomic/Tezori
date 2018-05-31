export default function request(url, method, body) {
  // TODO: Remove when backend is implemented
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 5000 * Math.random());
  });
  // return fetch(url, {
  //   method: method.toUpperCase(),
  //   ...(method.toLowerCase() === 'post' && { body }),
  // })
}
