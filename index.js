import React from 'react';
import MessageWebView from './MessageWebView';
import PropTypes from 'prop-types';
import {Linking} from 'react-native';

const RECAPTCHA_SUB_STR="https://www.google.com/recaptcha/api2/anchor?";

const getWebViewContent = (siteKey, action, onReady) => {
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
    containerStyle,
    onMessage,
    siteKey,
    url,
    action,
    onReady,
    onExecute
}) => {
    
    const onShouldStartLoadWithRequest = (event) => {
        if (event.url === url || event.url.indexOf(RECAPTCHA_SUB_STR) !== -1) {
            return true;
        }
        Linking.openURL(event.url);
        return false;
    }

    return (
    <MessageWebView
        ref={(ref) => { this.webview = ref ;}}
        mixedContentMode={'always'}
        style={containerStyle}
        onMessage={(message) => onExecute(message)}
        source={{
            html: getWebViewContent(siteKey, action, onReady, onExecute),
            baseUrl: url
        }}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        />  
    );
}

ReCaptcha.propTypes = {
    onMessage: PropTypes.func,
    containerStyle: PropTypes.any,
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
    action: '',
    containerStyle: {
        width: '100%',
        height: '100%',
        zIndex: 20,
        position: 'relative',
        marginBottom: 50
    }
};

export default ReCaptcha;