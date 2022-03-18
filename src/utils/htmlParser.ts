export const convertHtmlStringToDOM = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  return doc.body;
};

export const convertDOMToHtmlString = (dom: Element) => {
  const html = new XMLSerializer().serializeToString(dom);
  return html;
};
