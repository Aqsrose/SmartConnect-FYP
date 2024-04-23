import React, { useEffect, useRef, useState } from "react"
import {
  FaMicrophone,
  FaPause,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa"
import { MdSend } from "react-icons/md"
import WaveSurfer from "wavesurfer.js"

interface CaptureAudioProps {
  hide: (value: boolean) => void
}

const CaptureAudio: React.FC<CaptureAudioProps> = ({ hide }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<HTMLAudioElement | null>(
    null
  )
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const waveFormRef = useRef<HTMLDivElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const formatTime = (time: number): string => {
    if (isNaN(time)) return "00:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        // setRecordingDuration((prevDuration) => {
        //     setTotalDuration(prevDuration + 1);
        //     return prevDuration;
        // });
        setRecordingDuration((prevDuration) => prevDuration + 1)
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [isRecording])

  useEffect(() => {
    if (waveFormRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc", // Dark theme wave color
        progressColor: "#4a9eff", // Progress color
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        interact: false,
        normalize: true,
      })

      setWaveform(wavesurfer)

      wavesurfer.on("finish", () => {
        setIsPlaying(false)
      })

      return () => {
        wavesurfer.destroy()
      }
    }
  }, [])
  useEffect(() => {
    if (waveform) handleStartRecording()
  }, [waveform])

  useEffect(() => {
    if (recordedAudio) {
      const updateplaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime)
      }
      recordedAudio.addEventListener("timeupdate", updateplaybackTime)
      return () => {
        recordedAudio.removeEventListener("timeupdate", updateplaybackTime)
      }
    }
  }, [recordedAudio])

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveform?.stop()
      waveform?.play()
      recordedAudio.play()
      setIsPlaying(true)
    }
  }

  const handlePauseRecording = () => {
    waveform?.stop()
    recordedAudio?.pause()
    setIsPlaying(false)
  }

  const handleStartRecording = () => {
    setRecordingDuration(0)
    setCurrentPlaybackTime(0)
    setTotalDuration(0)
    setIsRecording(true)
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        if (audioRef.current) {
          audioRef.current.srcObject = stream

          const chunks: BlobPart[] = []
          mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" })
            const audioURL = URL.createObjectURL(blob)
            const audio = new Audio(audioURL)
            setRecordedAudio(audio)
            waveform?.load(audioURL)
          }
          mediaRecorder.start()
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      waveform?.stop()

      // Release microphone access after stopping recorder
      const mediaStream = mediaRecorderRef.current.stream
      if (mediaStream && mediaStream.active) {
        mediaStream.getTracks().forEach((track) => track.stop())
      }
      // release code end

      const audioChunks: Blob[] = []
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data)
      })
      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" })
        const audioURL = URL.createObjectURL(audioBlob)
        const audioElement = new Audio(audioURL)
        setRecordedAudio(audioElement)
      })
    }
  }

  const sendRecording = async () => {
    alert("Voice Send ")
  }

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash
          className="text-panel-header-icon"
          onClick={() => hide(false)}
        />
      </div>
      <div className="mx-4 py-2 px-4 text-white gap-3 text-lg flex justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-pulse 2-60 text-center">
            Recording <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />

        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>
      <div className="mr-4">
        {!isRecording ? (
          <FaMicrophone
            className="text-red-500"
            onClick={handleStartRecording}
          />
        ) : (
          <FaPauseCircle
            className="text-red-500"
            onClick={handleStopRecording}
          />
        )}
      </div>
      <div>
        <MdSend
          className="text-panel-header-icon cursor-pointer mr-4"
          title="Send"
          onClick={sendRecording}
        />
      </div>
    </div>
  )
}

export default CaptureAudio
