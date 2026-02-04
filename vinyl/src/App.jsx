import './css/App.css'
import Scene from './Scene'
import Songs from './Songs'
import Player from './Player'
import gsap from 'gsap'
import { useState, useRef, useEffect } from 'react'

function App() {
  //State
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [songIndex, setSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  //Songs list
  const songs = [
        {name : "Dafvnk", artist: "VIL", file: "/audio/01 - Dafvnk.mp3", image: "/cover-art/Screenshot 2026-02-04 at 16.03.17.png"},
        {name : "Wolf Bat", artist: "Mabel", file: "/audio/05 Wolf Bat.mp3", image: "/cover-art/Screenshot 2026-02-04 at 16.03.29.png"},
        {name : "Zirzamin (Persian Delight)", artist: "SinaXX", file: "/audio/Sina XX - Zirzamin (Persian Delight).mp3", image: "/cover-art/Screenshot 2026-02-04 at 16.03.37.png"}
    ]

  //Update song progress bar
  useEffect(() => {
    const audio = audioRef.current

    //Get duration when song loads
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    //Update current time as song plays
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    //Play next song when current ends
    const handleSongEnd = () => {
      nextSong()
    }

    // Attach listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleSongEnd)

    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleSongEnd)
    }
  }, [nextSong])

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

    function handleSeek(newTime) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }

  function handleClick() {
    //Stop music playing when vinyl closes
    if(isPlaying) {
      const tl = gsap.timeline()
      //Fade-out song stuff
      tl.to('.music-player',
            { 
              opacity: 0, 
              y: -20, 
              duration: 0.3, 
            }
        )
        tl.to(['#song-artist', '#song-name', '#song-img'],
            { 
              opacity: 0, 
              y: -20, 
              duration: 0.2, 
              stagger: 0.15,
              onComplete: () => {
              //Wait for isPlaying state to update, allow animation to run
              setIsPlaying(false)
              audioRef.current.pause()  // Pause when isPlaying = false 
              audioRef.current.currentTime = 0 
              setIsSongPlaying(false)
        }
            })
          //Animate back to centered
          tl.to('.songs-container', {
                  x: '100%',           // Slide back off-screen right
                  opacity: 0,
                  duration: 0.2,
                  ease: 'power2.inOut'
                })

          tl.to('.scene-container', {
                  width: '100vw',
                  duration: 1.5,
                  ease: 'power2.inOut'
          })   
    } else {
      //Opening, update state immediately to begin animation
      setIsPlaying(true)
      audioRef.current.src = songs[0].file
      setSongIndex(0)

       const tl = gsap.timeline()
      // Set text to hidden IMMEDIATELY (before container animates)
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
          duration: 1, 
          ease: 'power2.out',
          onComplete: () => {
          // NOW animate the text (elements exist now)
          gsap.to(['#song-img', '#song-name', '#song-artist'],
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.6, 
              stagger: 0.3,
              onStart: () => console.log('Animation started!'),
              onComplete: () => console.log('Animation completed!')
            }
          )

          gsap.to('.music-player',
              { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                delay: 1
              }
          )
        }
       } //End state
      )
    }
  }

  return (
    <div className='app-container' >
      <div className='scene-container'>
        <Scene 
          isHovered={isHovered} 
          isPlaying={isPlaying}
          isSongPlaying={isSongPlaying}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onClick={handleClick}
        />
      </div>

      {/*Songs (only show when playing)*/}
      {isPlaying && (
        <div className='songs-container'>
          <Songs 
            key={songs[songIndex]} onClick={() => playSong(songs[songIndex])} 
            image={songs[songIndex].image}
            name={songs[songIndex].name} 
            artist={songs[songIndex].artist} 
            file={songs[songIndex].file}
          />
          <Player 
            isSongPlaying={isSongPlaying} 
            nextSong={nextSong} 
            prevSong={prevSong} 
            playSong={playSong} 
            togglePlayPause={togglePlayPause}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>
      )}
    </div>
  )
}

export default App
