import { useEffect, useRef, useState } from 'react'
import AgoraManager from '../../utils/agora_manager'
import micIconOn from '../../assets/micIconOn.svg'
import micIconOff from '../../assets/micIconOff.svg'
import speakerIconOn from '../../assets/speakerIconOn.svg'
import speakerIconOff from '../../assets/speakerIconOff.svg'
import { getRoomCode, myPlayer } from 'playroomkit'

export const VoiceChat = ({ uid }) => {
  const channelParameters = useRef({}).current
  const [remoteTrack, setRemoteTrack] = useState()
  const agoraClient = useRef()
  const [micAllowed, setMicAllowed] = useState(false)
  const [micOn, setMicOn] = useState(false)
  const [spkOn, setSpkOn] = useState(false)

  const handleVSDKEvents = (eventName, ...args) => {
    switch (eventName) {
      case 'user-published':
        // Subscribe the remote audio track If the remote user publishes the audio track only.
        if (args[1] == 'audio') {
          // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
          setRemoteTrack(args[0].audioTrack)
        }
    }
  }

  useEffect(() => {
    channelParameters.localAudioTrack && channelParameters.localAudioTrack.setEnabled(micOn)
    myPlayer().setState('withVoiceChat', micOn)

    if (spkOn) {
      remoteTrack && remoteTrack.play()
    } else {
      remoteTrack && remoteTrack.stop()
    }
  }, [micOn, spkOn, remoteTrack])

  const startVoiceChat = async () => {
    agoraClient.current = await AgoraManager(handleVSDKEvents)
    const result = await agoraClient.current.join(uid, `playroom-rpm-${getRoomCode()}`, channelParameters)

    // muted by default
    channelParameters.localAudioTrack.setEnabled(false)

    // mic state based on result
    setMicAllowed(result === true)
  }

  useEffect(() => {
    // joins the channel at mount
    startVoiceChat()

    return () => {
      agoraClient && agoraClient.current.leave(channelParameters)
    }
  }, [])

  const toggleMic = async () => {
    if (!micAllowed) return
    setMicOn(v => !v)
  }

  const toggleSpk = async () => {
    setSpkOn(v => !v)
  }

  return (
    <>
      <a
        className={`select-none rounded-full h-10 w-10 mr-3 flex justify-center cursor-pointer`}
        onContextMenu={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onClick={toggleSpk}
      >
        <img src={spkOn ? speakerIconOn : speakerIconOff} className={`w-10 ${spkOn ? 'opacity-100' : 'opacity-50'}	`} />
      </a>
      <a
        className='select-none rounded-full h-10 w-10 mr-3 flex justify-center cursor-pointer'
        onContextMenu={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onClick={toggleMic}
      >
        <img src={micOn ? micIconOn : micIconOff} className={`w-10 ${micOn ? 'opacity-100' : 'opacity-50'}	`} />
      </a>
    </>
  )
}
