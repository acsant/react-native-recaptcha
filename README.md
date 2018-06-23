# react-native-recaptcha
A react native wrapper for google recaptcha v3

## Installation
````
npm install --save react-native-recaptcha-v3
```

## Usage
```
<ReCaptcha {...props} />
```

### Props

* `containerStyle` An object that specifies the display style for the recaptcha badge.

* `siteKey` A string representing the siteKey provided in the google recaptcha admin console.

* `url` Initial url for ReCaptcha

* `action` A string representing the ReCaptcha action (Refer to the ReCaptcha v3 document)

* `onReady` A function that is executed when the ReCaptcha badge is loaded.

* `onExecute` A function to handle the response of ReCaptcha. Takes in a parameter that represents the
response token from the ReCaptcha.
