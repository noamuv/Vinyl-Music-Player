import './css/App.css'
import Scene from './Scene'
import Songs from './Songs'
import Player from './Player'
import gsap from 'gsap'
import { useState, useRef } from 'react'

function App() {
  //State
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [songIndex, setSongIndex] = useState(0);
  const audioRef = useRef(new Audio());

  //Songs list
  const songs = [
        {name : "Dafvnk", artist: "VIL", file: "/audio/01 - Dafvnk.mp3"},
        {name : "Wolf Bat", artist: "Mabel", file: "/audio/05 Wolf Bat.mp3"},
        {name : "Zirzamin (Persian Delight)", artist: "SinaXX", file: "/audio/Sina XX - Zirzamin (Persian Delight).mp3"}
    ]

  //Audio functionality
  function playSong(i) {
      const songFile = songs[i].file
      audioRef.current.src = songFile
      audioRef.current.play()
      setSongIndex(i)
      setIsSongPlaying(true)
  }

  function togglePlayPause() {
      if (isSongPlaying) {
        audioRef.current.pause()  // ← Actually pause
        setIsSongPlaying(false)
      } 
      else {
        audioRef.current.play()   // ← Actually play
        setIsSongPlaying(true)
      }
  }

    function prevSong() {
        const nextIndex = (songIndex - 1 + songs.length) % songs.length
        playSong(nextIndex)
    }

    function nextSong() {
        const nextIndex = (songIndex + 1) % songs.length
        playSong(nextIndex)
    }



  function handleClick() {
    setIsPlaying(!isPlaying);

    if (!isPlaying) {
      const tl = gsap.timeline()

      // Set text to hidden IMMEDIATELY (before container animates)
      gsap.set('.songs-container h1', { opacity: 0, y: -20 })
      gsap.set('.song-item', { opacity: 0, y: -20 })
      
      //Canvas shrinks
      tl.to('.scene-container', {
        width: '50vw',
        duration: 2,
        ease: 'power2.inOut'
      })

      tl.fromTo('.songs-container', 
        { opacity: 0, x: '100%' },
        { 
          opacity : 1, 
          x: '0%', 
          duration: 0.001, 
          ease: 'power2.out',
          onComplete: () => {
          // NOW animate the text (elements exist now)
          gsap.fromTo('.songs-container h1',
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.4 }
          )

          gsap.fromTo('.song-item',
            { opacity: 0, y: -20 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.4, 
              stagger: 0.15,
              delay: 0.5  // Start after h1
            }
        )

        gsap.fromTo('.music-player',
            { opacity: 0, y: -20 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.4, 
              delay: 1.5
            }
        )
        }
       } //End state
      )



    } else {

      const tl = gsap.timeline()
      //Animate back to centered
      tl.to('.songs-container', {
        x: '100%',           // Slide back off-screen right
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      })

      tl.to('.scene-container', {
        width: '100vw',
        duration: 1.5,
        ease: 'power2.inOut'
      })
    }

  }

  return (
    <div className='app-container' >
      <div className='scene-container'>
        <Scene 
          isHovered={isHovered} 
          isPlaying={isPlaying}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onClick={handleClick}
        />
      </div>

      {/*Songs (only show when playing)*/}
      {isPlaying && (
        <div className='songs-container'>
            <h1>Now Playing</h1>
          <ul>
                {songs.map((song, i) => (
                  <Songs key={i} onClick={() => playSong(i)} name={song.name} artist={song.artist} file={song.file}/>
                ))}
          </ul>
          <Player isSongPlaying={isSongPlaying} nextSong={nextSong} prevSong={prevSong} playSong={playSong} togglePlayPause={togglePlayPause}/>
        </div>
      )}
    </div>
  )
}

export default App
