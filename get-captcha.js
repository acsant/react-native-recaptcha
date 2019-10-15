export const invisibleRecaptcha = (siteKey, action, onReady) => {
    return `<!DOCTYPE html><html><head>
        <style>.text-xs-center { text-align: center; } .g-recaptcha { display: inline-block; }</style>
        <script src="https://www.google.com/recaptcha/api.js?render=${siteKey}"></script>
        <script type="text/javascript">
            grecaptcha.ready(function() {
                (${String(onReady)})();
                 grecaptcha.execute(${siteKey}, { action: ${action} }).then(
                    function (responseToken) { 
                        window.postMessage(responseToken); 
                    }
                  );
            });
        </script>
        </head></html>`;
};

export const normalRecaptcha = (config) => {
    return `<!DOCTYPE html>
        <html>
            <head>
                <style>.text-xs-center { text-align: center; } .g-recaptcha { display: inline-block; margin-right: 40px; float: right;}</style>
                <script src="https://www.gstatic.com/firebasejs/5.1.0/firebase-app.js"></script>
                <script src="https://www.gstatic.com/firebasejs/5.1.0/firebase-auth.js"></script>
                <script type="text/javascript">firebase.initializeApp(${JSON.stringify(config)});
                </script><script src="https://www.google.com/recaptcha/api.js"></script>
            </head>
            <body>
                <div id="recaptcha-cont" class="g-recaptcha"></div>
                <script>
                    function onloadCallback() {
                        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-cont",
                        {size: "normal", callback: function(response) { 
                            window.postMessage(response); 
                        }});
                        window.recaptchaVerifier.render();
                    }
                </script>
                <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"></script>
            </body> 
        </html>`;
};