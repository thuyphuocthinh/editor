import { EDITOR_ERROR } from "../constants/errors.const";

export const formatError = (domain, message) => {
  return `${EDITOR_ERROR}::${domain} ===> ${message}`;
};
