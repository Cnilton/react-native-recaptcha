import React, {
  forwardRef,
  useState,
  useRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  FunctionComponent,
  useEffect,
} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {WebView} from 'react-native-webview';

import {styles} from './styles';

interface RecaptchaProps {
  onMessage: (event: string) => void;
  siteKey: string;
  url?: string;
  languageCode?: string;
}

interface RefType {
  show: () => void;
  hide: () => void;
}

interface WrapperProps {
  /** Recaptcha site key */
  siteKey: string;
  /** Site url which contains recaptcha */
  baseUrl: string;
  /** Default language shown within recaptcha. en-US | pt-BR | ... */
  languageCode?: string;
  /** Callback for recaptcha error or success */
  onMessage: (event: string) => void;
  /** Set your custom cancel button text */
  cancelButtonText?: string;
  /** Callback for pressing the cancel button */
  onCancel: () => void;
}

/**
 *
 * @param {*} onMessage: callback after received response, error of Google captcha or when user cancel
 * @param {*} siteKey: your site key of Google captcha
 * @param {*} url: base url
 * @param {*} languageCode: can be found at https://developers.google.com/recaptcha/docs/language
 * @param {*} cancelButtonText: title of cancel button
 */
const Recaptcha: FunctionComponent<RecaptchaProps> = ({
  onMessage,
  siteKey,
  url,
  languageCode,
}) => {
  const webviewRef = useRef<WebView>(null);
  const [patchPostMessage, setPatchPostMessage] = useState('');
  const captchaValue = useRef('');

  useEffect(() => {
    setPatchPostMessage(
      `(${String(() => {
        if (webviewRef.current !== null) {
          let originalPostMessage = webviewRef.current.postMessage;
          let patchedPostMessage = (message: string) => {
            originalPostMessage(message);
          };
          patchedPostMessage.toString = () =>
            String(Object.hasOwnProperty).replace(
              'hasOwnProperty',
              'postMessage',
            );
          webviewRef.current.postMessage = patchedPostMessage;
        }
      })})();`,
    );
  }, [webviewRef]);

  const generateTheWebViewContent = (key: string) => {
    const originalForm = `<!DOCTYPE html>
			<html>
      <head>
				<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="X-UA-Compatible" content="ie=edge">
			</head>
      <body style="width: 200px; margin-top: 0px; margin: 0px 0px 0px 0px; padding: 0px 0px 0px 0px; padding-top: 0px; display: inline-block;">
				<div style="width: 200px; margin-top: 0px; margin: 0px 0px 0px 0px; padding:0px 0px 0px 0px; padding-top: 0px; display: inline-block;" id="captcha">
          <div style="width: 200px; margin-top: 0px; margin: 0px 0px 0px 0px; padding: 0px 0px 0px 0px; padding-top: 0px; display: inline-block;" class="g-recaptcha"
            data-size="invisible"
            data-badge="inline"
            data-sitekey="${key}"
            data-callback="onDataCallback"
						data-expired-callback="onDataExpiredCallback"
            data-error-callback="onDataErrorCallback">
					</div>
        </div>

      </body>
      <script type="text/javascript">
				var onDataCallback = function(response) {
          window.ReactNativeWebView.postMessage(response);
				};
				var onDataExpiredCallback = function(error) {  window.ReactNativeWebView.postMessage("expired"); };
        var onDataErrorCallback = function(error) {  window.ReactNativeWebView.postMessage(error); }
        </script>
        <script src="https://google.com/recaptcha/api.js${
          languageCode ? `?hl=${languageCode}` : ''
        }"></script>
      <script type="text/javascript">
        var onload = function() {
          grecaptcha.execute();
        };
        onload();
        </script>
			</html>`;
    return originalForm;
  };

  return (
    <View style={styles.webViewOutterContainer}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        mixedContentMode="always"
        onMessage={event => {
          captchaValue.current = event.nativeEvent.data;
          onMessage(event.nativeEvent.data);
        }}
        scalesPageToFit={false}
        javaScriptEnabled
        cacheEnabled={false}
        domStorageEnabled
        javaScriptCanOpenWindowsAutomatically
        onLoadEnd={() => {
          let time = setTimeout(() => {
            if (!captchaValue.current) {
              onMessage('Timeout');
              clearTimeout(time);
            }
          }, 8000);
        }}
        onError={err => {
          console.log(err);
        }}
        injectedJavaScript={patchPostMessage}
        containerStyle={styles.webviewContentContainer}
        // @ts-ignore
        style={styles.webview}
        source={{
          html: generateTheWebViewContent(siteKey),
          baseUrl: `${url}`,
        }}
      />
    </View>
  );
};

const Wrapper: ForwardRefRenderFunction<RefType, WrapperProps> = (
  {siteKey, baseUrl, languageCode, onMessage, cancelButtonText, onCancel},
  ref,
) => {
  const [showModal, setShowModal] = useState(false);

  useImperativeHandle(ref, () => ({
    show() {
      setShowModal(true);
    },
    hide() {
      setShowModal(false);
    },
  }));

  return (
    <View
      style={[
        styles.container,
        showModal && {
          position: 'absolute',
          height: '100%',
          width: '100%',
          zIndex: 9,
        },
        {display: showModal ? 'flex' : 'none'},
      ]}>
      <Recaptcha
        url={baseUrl}
        siteKey={siteKey}
        onMessage={onMessage}
        languageCode={languageCode}
      />

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          setShowModal(false);
          onCancel();
        }}>
        <Text style={styles.closeButtonText}>
          {cancelButtonText || 'Fechar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default forwardRef(Wrapper);
