import mixpanel from 'mixpanel-browser';

mixpanel.init('2647310162474a4f7ca66a277c543032', {
  api_host: `https://ws.joinplayroom.com/__mix`
});

export function identify(uuid: any, data: any) {
  mixpanel.identify(uuid);
  mixpanel.people.set(data);
}

export function track(event: any, data: any) {
  try {
    mixpanel.track(event, data);
  } catch (e) {}
}