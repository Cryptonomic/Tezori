export default function request(url, method, body) {
  // TODO: Remove when backend is implemented
  // May need to use electron client-request instead https://electronjs.org/docs/api/client-request
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
