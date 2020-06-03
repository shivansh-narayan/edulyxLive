export default {
  changeWebcam: (deviceId) => {
    Session.set('WebcamDeviceId', deviceId);
  },
  webcamDeviceId: () => Session.get('WebcamDeviceId'),
  changeProfile: (profileId) => {
    console.error(`${profileId}ye hai`);
    Session.set('WebcamProfileId', profileId);
  },
};
