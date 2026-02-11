export function encodeBouquet(data) {
  try {
    const json = JSON.stringify(data);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    return encoded;
  } catch (e) {
    console.error('Failed to encode bouquet:', e);
    return null;
  }
}

export function decodeBouquet(encoded) {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to decode bouquet:', e);
    return null;
  }
}
