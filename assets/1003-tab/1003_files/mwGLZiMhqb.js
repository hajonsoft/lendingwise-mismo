// Upscope configuration for lendingwise.com

  window.Upscope.__defaultConfiguration = {
  "beta": false,
  "teamDomain": "lendingwise.com",
  "showUpscopeLink": true,
  "showTerminateButton": true,
  "trackConsole": false,
  "allowRemoteConsole": false,
  "allowRemoteScroll": false,
  "allowRemoteClick": false,
  "allowRemoteType": false,
  "injectLookupCodeButton": false,
  "enableLookupCodeOnKey": false,
  "requireAuthorizationForSession": true,
  "authorizationPromptTitle": "LendingWise Support for Co-Browsing Request",
  "resetConnectionOnLogOut": true,
  "translationsYes": "Yes",
  "translationsNo": "No",
  "showAgentRequestButton": "never",
  "collectHistory": false,
  "autoconnect": true,
  "allowAgentRedirect": false,
  "rewriteExternalLinks": false,
  "proxyEnabled": true,
  "apiKey": "mwGLZiMhqb"
};
  window.Upscope.__defaultRegion = "us-west";

  var scriptUrl = 'https://js.upscope.io/upscope-1.17.14.js';

  if ('noModule' in HTMLScriptElement.prototype)
    scriptUrl = scriptUrl.replace(/.js$/, '.es6.js');

  if (window.Upscope.addScript) {
    window.Upscope.addScript(scriptUrl);
  } else {
    (function(){
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.charset = 'utf-8';
      s.src = scriptUrl;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    })();
  }
