import {Dimensions, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.49)',
    margin: 0,
    padding: 0,
  },
  webViewOutterContainer: {
    padding: 0,
    paddingBottom: 0,
    marginBottom: 0,
    height: 492,
    paddingTop: 0,
    flexShrink: 1,
    paddingVertical: 0,
    marginTop: 0,
    marginVertical: 0,
    margin: 0,
    // width: 303,
  },
  webviewContentContainer: {
    alignItems: 'center',
  },
  webview: {
    flexShrink: 1,
    width: 302,
    // backgroundColor: 'rgba(0, 0, 0, 0)',
    backgroundColor: '#000',
    // padding: 0,
    paddingTop: 30,
    // paddingVertical: 0,
    margin: 0,
    marginTop: 0,
    marginVertical: 0,
    alignSelf: 'center',

    // height: 430,
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
  },
});
