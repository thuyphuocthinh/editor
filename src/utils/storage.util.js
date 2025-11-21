export const addNewItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const removeItem = (key) => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    return true;
  }
  return false;
};

export const clearStorage = () => {
  localStorage.clear();
};
