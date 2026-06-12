export const API = "http://localhost:5000/api";

export const apiFetch = (url, opts = {}) =>
  fetch(url, {
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  });

export const apiAuth = (url, token, opts = {}) =>
  apiFetch(url, {
    ...opts,
    headers: { ...opts.headers, Authorization: "Bearer " + token },
  });
