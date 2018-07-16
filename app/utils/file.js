export function fileToDataURL(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        return resolve(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = (err) => {
      return reject(err);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
}