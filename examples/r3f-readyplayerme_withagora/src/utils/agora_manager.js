import AgoraRTC from 'agora-rtc-sdk-ng'
import { RtcTokenBuilder, RtcRole } from 'agora-token'

const generateRtcToken = (uid, channelName) => {
  // Rtc Examples
  const appId = 'YOUR_APP_ID'
  const appCertificate = 'YOUR_APP_CERTIFICATE'
  const role = RtcRole.PUBLISHER

  const expirationTimeInSeconds = 3600

  const currentTimestamp = Math.floor(Date.now() / 1000)

  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

  // Build token with uid
  const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)

  return tokenA
}

const AgoraManager = async eventsCallback => {
  let agoraEngine = null

  // Set up the signaling engine with the provided App ID, UID, and configuration
  const setupAgoraEngine = async () => {
    agoraEngine = new AgoraRTC.createClient({ mode: 'rtc', codec: 'vp9' })
  }
  await setupAgoraEngine()

  // Event Listeners
  agoraEngine.on('user-published', async (user, mediaType) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType)
    eventsCallback('user-published', user, mediaType)
  })

  // Listen for the "user-unpublished" event.
  agoraEngine.on('user-unpublished', user => {
    console.log(user.uid + 'has left the channel')
  })

  const getAgoraEngine = () => {
    return agoraEngine
  }

  const config = {
    appId: 'YOUR_APP_ID',
    channelName: '',
    token: '',
  }

  const join = async (uid, channel, channelParameters = {}) => {
    const token = generateRtcToken(uid, channel)
    config.channelName = channel
    config.token = token

    await agoraEngine.join(config.appId, config.channelName, config.token, uid)
    // Create a local audio track from the audio sampled by a microphone.
    try {
      channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
      await getAgoraEngine().publish([channelParameters.localAudioTrack])
     
      return true
    } catch (e) {
      return e.code
    }
  }

  const leave = async channelParameters => {
    // Destroy the local audio and video tracks.
    channelParameters.localAudioTrack.close()
    // Remove the containers you created for the local video and remote video.
    await agoraEngine.leave()
  }

  // Return the agoraEngine and the available functions
  return {
    getAgoraEngine,
    config,
    join,
    leave,
  }
}

export default AgoraManager
