import { useRef, useEffect } from 'react';
import './video.css';

function Video({
  stream,
  muted,
  visible
}) {

  const userVideo = useRef();

  useEffect(() => {
    if (userVideo.current) {
      userVideo.current.srcObject = stream;
    }
  })

  return (
    visible ? 
    <video className='video' playsInline muted={muted} ref={userVideo} autoPlay />
    : <video style={{
      display: 'none'
    }} playsInline muted={muted} ref={userVideo} autoPlay />
  );
}

export default Video;
