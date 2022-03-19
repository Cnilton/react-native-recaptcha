![npm](https://img.shields.io/npm/v/react-native?color=%232fa90f&label=react-native&style=plastic)
![npm](https://img.shields.io/npm/dm/@cbarroso/react-native-recaptcha?style=plastic)
![npm](https://img.shields.io/npm/dt/@cbarroso/react-native-recaptcha?style=plastic)

# About

This is a React-Native Recaptcha component that is customizable;

# Installation

```bash
npm i @cbarroso/react-native-recaptcha
```

or

```bash
yarn add @cbarroso/react-native-recaptcha
```

## ⚠ Important

This component uses react-native-webview, so please run the following installation:

```bash
npm i react-native-webview
```

or

```bash
yarn add react-native-webview
```

```javascript
interface RecaptchaProps {
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
  /** Recaptcha version */
  recaptchaVersion?: 'v2' | 'v3';
}
```

# Usage

```javascript
import React, {useState} from 'react';
import {Recaptcha} from 'react-native-recaptcha';

interface CaptchaRefProps {
  hide: () => void;
  show: () => void;
}

export default function App() {
  const [captcha, setCaptcha] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);

  const captchaRef = useRef < CaptchaRefProps > null;

  const onCancel = () => {
    setShowCaptcha(false);
  };

  const onMessage = (event: string) => {
    if (event !== 'expired' && event !== 'error') {
      if (event.includes('Timeout')) {
        captchaRef?.current?.show();
      } else if (['cancel', 'error', 'expired'].includes(event)) {
        captchaRef.current?.hide();
        setCaptcha('');
        setShowCaptcha(false);
      } else {
        setCaptcha(event);
        setShowCaptcha(false);
        setTimeout(() => {
          captchaRef?.current?.hide();
        }, 1500);
      }
    } else {
      setLoading(false);
      captchaRef?.current?.hide();
      setCaptcha('');
      setShowCaptcha(false);
    }
  };

  return (
    <View>
      {showCaptcha && (
        <Recaptcha
          ref={captchaRef}
          recaptchaVersion="v2" // 'v3'
          onCancel={onCancel}
          siteKey={SITE_KEY}
          baseUrl={YOUR_URL}
          languageCode="pt-BR"
          cancelButtonText="Cancelar"
          onMessage={onMessage}
        />
      )}
    </View>
  );
}
```
