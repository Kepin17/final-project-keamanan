const urlApi = "http://localhost:8000/api";

export const getUrlApiWithPath = (path) => {
  return `${urlApi}/${path}`;
};
