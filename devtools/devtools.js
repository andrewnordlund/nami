function initialisePanel() {
  console.log("panel is being shown");
}

function unInitialisePanel() {
  console.log("panel is being hidden");
}


browser.devtools.panels.create(
  "NAMI Panel",                      // title
  "/icons/nami-19.png",                // icon
  "/devtools/panel/nami-panel.html"      // content
).then((newPanel) => {
  newPanel.onShown.addListener(initialisePanel);
  newPanel.onHidden.addListener(unInitialisePanel);
});
console.log ("nami devtools.js loaded");
