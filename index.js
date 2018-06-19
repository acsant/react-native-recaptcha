import React from 'react';
import MessageWebView from './MessageWebView';
import PropTypes from 'prop-types';

const getWebViewContent = (siteKey, action, onReady, onExecute) => {
    const webForm = '<!DOCTYPE html><html><head> ' +
    '<style>  .text-xs-center { text-align: center; } .g-recaptcha { display: inline-block; } </style> ' +
    '<script src="https://www.google.com/recaptcha/api.js?render=' + siteKey + '"></script> ' +
    '<script type="text/javascript"> ' +
    'grecaptcha.ready(function() { ' +
        `(${String(onReady)})(); ` +
        'grecaptcha.execute(\'' + siteKey + '\', {action: \'' + action + '\'}).then( '+ 
            'function (responseToken) { window.postMessage(responseToken);  } ' +
        ' ); ' +
    '}); ' +
    '</script>' +
    '</head></html>';
    return webForm;
}

const ReCaptcha = ({
    onMessage,
    siteKey,
    url,
    action,
    onReady,
    onExecute
}) => {
return (
  <MessageWebView
    ref={(ref) => { this.webview = ref ;}}
    mixedContentMode={'always'}
    style={[{ backgroundColor: 'transparent', height: 500 }]}
    onMessage={(message) => onExecute(message)}
    source={{
        html: getWebViewContent(siteKey, action, onReady, onExecute),
        baseUrl: url
    }}
    />  
);
}

ReCaptcha.propTypes = {
    onMessage: PropTypes.func,
    siteKey: PropTypes.string.isRequired,
    url: PropTypes.string,
    action: PropTypes.string,
    onReady: PropTypes.func,
    onExecute: PropTypes.func
};

ReCaptcha.defaultProps = {
    url: '',
    onReady: () => {},
    onExecute: () => {},
    action: ''
};

export default ReCaptcha;
