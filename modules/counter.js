export const Counter = () => {
  let counterCtn;

  const process = (element, content = "") => {
    counterCtn = element;
    if (!counterCtn) return;
    const displayEle = counterCtn.querySelector("#counter-number");
    if (!displayEle) return;
    displayEle.textContent = content.trim().split(" ").length;
  };

  return {
    start(element, content) {
      process(element, content);
    },
  };
};
