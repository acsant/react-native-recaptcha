import React from 'react';
import { WebView } from 'react-native';
import PropTypes from 'prop-types';

const getWebViewContent = (siteKey, action, onReady, onExecute) => {
    const webForm = '<!DOCTYPE html><html><head> ' +
    '<style>  .text-xs-center { text-align: center; } .g-recaptcha { display: inline-block; } </style> ' +
    '<script src="https://www.google.com/recaptcha/api.js?render=' + siteKey + '"></script> ' +
    '<script type="text/javascript"> ' +
    'grecaptcha.ready(function() {' +
        onReady
        'grecaptcha.execute(\'' + siteKey + '\', {action: \'' + action + '\'}).then('+ onExecute +'); ' +
    '}); ' +
    '</script>' +
    '</head></html>';
    return webForm;
}

const ReCaptcha = ({
    onMessage,
    siteKey,
    url,
    onReady,
    onExecute
}) => {
return (
  <WebView
    ref={(ref) => { this.webview = ref ;}}
    mixedContentMode={'always'}
    javaScriptEnabled
    automaticallyAdjustContentInsets
    style={[{ backgroundColor: 'transparent', height: 500 }]}
    source={{
        html: getWebViewContent(siteKey, onReady, onExecute),
        baseUrl: url
    }}
    />  
);
}

ReCaptcha.propTypes = {
    onMessage: PropTypes.func,
    siteKey: PropTypes.string.isRequired,
    url: PropTypes.string,
    onReady: PropTypes.func,
    onExecute: PropTypes.func
};

ReCaptcha.defaultProps = {
    url: '',
    onRead: () => {},
    onExecute: () => {}
};

export default ReCaptcha;