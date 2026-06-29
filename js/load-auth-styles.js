const href = "css/auth.css";
const alreadyLoaded = [...document.styleSheets].some((sheet) => sheet.href && sheet.href.endsWith(href));

if (!alreadyLoaded) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
