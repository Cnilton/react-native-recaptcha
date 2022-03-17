![npm](https://img.shields.io/npm/v/react-native?color=%232fa90f&label=react-native&style=plastic)
![npm](https://img.shields.io/npm/dm/@cbarroso/react-native-recaptcha?style=plastic)
![npm](https://img.shields.io/npm/dt/@cbarroso/react-native-recaptcha?style=plastic)

# About

This is a React-Native Recaptcha component that is customizable. Currently only recaptcha v2 is available.

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
