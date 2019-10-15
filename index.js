import React, { Component } from "react";
import MessageWebView from "./MessageWebView";
import PropTypes from "prop-types";
import { Platform, Linking } from "react-native";

import { invisibleRecaptcha, normalRecaptcha } from "./get-captcha";

const RECAPTCHA_SUB_STR = "https://www.google.com/recaptcha/api2/anchor?";
const RECAPTCHA_SUB_STR_FRAME = "https://www.google.com/recaptcha/api2/bframe";

export const type = Object.freeze({ "invisible": 1, "normal": 2 });

export default class ReCaptcha extends Component {

    static propTypes = {
        onMessage: PropTypes.func,
        containerStyle: PropTypes.any,
        siteKey: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        action: PropTypes.string,
        onReady: PropTypes.func,
        onExecute: PropTypes.func,
        customWebRecaptcha: PropTypes.func,
        reCaptchaType: PropTypes.oneOf(Object.values(type)).isRequired
    };

    static defaultProps = {
        onReady: () => {
        },
        onExecute: () => {
        },
        action: "",
        containerStyle: {
            width: "100%",
            height: "100%",
            zIndex: -1,
            position: "relative",
            marginBottom: 20
        },
        reCaptchaType: type.invisible
    };

    getSource = () => {
        const { action, config, onReady, recaptchaType, siteKey, url: baseUrl } = this.props;
        let html = normalRecaptcha(config);
        if (recaptchaType === type.invisible) {
            html = invisibleRecaptcha(siteKey, action, onReady);
        }
        return { html, baseUrl };
    };

    onMessage = (message) => {
        this.props.onExecute(message);
    };

    onNavigationStateChange = ({ canGoBack, loading, url: eventUrl }) => {
        if (Platform.OS === "android") {
            const { url } = this.props;
            if (url !== eventUrl && eventUrl.indexOf(RECAPTCHA_SUB_STR) === -1 && !!canGoBack && !loading) {
                Linking.canOpenURL(eventUrl).then(supported => {
                    if (!supported) {
                        console.log(`Can't handle url: ${url}`);
                    } else {
                        return Linking.openUrl(eventUrl);
                    }
                });
            }
            if (!!canGoBack) {
                this.webview.getWebViewHandle().goBack();
            }
        }
    };

    onShouldStartLoadWithRequest = ({ url: eventUrl }) => {
        const { config, url } = this.props;
        const hasCaptchaAnchor = eventUrl.indexOf(RECAPTCHA_SUB_STR) !== -1;
        const hasCaptchaFrame = eventUrl.indexOf(RECAPTCHA_SUB_STR_FRAME) !== -1;
        const hasFirebaseAuthDomain = (!!config && eventUrl.indexOf(config.authDomain) !== -1);
        if (eventUrl === url || hasCaptchaAnchor || hasFirebaseAuthDomain || hasCaptchaFrame) {
            return true;
        } else {
            Linking.canOpenURL(eventUrl).then(supported => {
                if (!supported) {
                    console.log(`Can't handle url: ${url}`);
                } else {
                    return Linking.openURL(eventUrl);
                }
            });
            return false;
        }
    };

    render() {
        return <MessageWebView
            ref={(ref) => this.webview = ref}
            scalesPageToFit={true}
            mixedContentMode={"always"}
            containerStyle={this.props.containerStyle}
            onMessage={this.onMessage}
            source={this.getSource()}
            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
            onNavigationStateChange={this.onNavigationStateChange}
        />;
    }
}
