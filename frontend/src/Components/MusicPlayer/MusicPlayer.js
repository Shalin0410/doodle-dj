import { useState, useRef, useEffect } from "react";
import { Button, Form, Card, Stack } from "react-bootstrap";
import { Play, Pause, Heart, Volume2 } from "lucide-react";
import "./MusicPlayer.css";
// interface Song {
//   title: string
//   artist: string
//   url: string
// }

const MusicPlayer = ({ songs, setSongs }) => {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      const playPromise = isPlaying
        ? audioRef.current.play()
        : audioRef.current.pause();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Playback error:", error);
          setError("Unable to play audio. Please try again.");
        });
      }
    }
  }, [isPlaying, currentSong]);

  // Autoplay first song when component mounts
  useEffect(() => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Initial autoplay error:", error);
          setError("Unable to autoplay. Please click play to start.");
          setIsPlaying(false);
        });
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // useEffect(() => {
  //   // Reset error when changing songs
  //   setError(null);
  // }, []); // Removed unnecessary dependency: currentSong

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressChange = (e) => {
    if (audioRef.current) {
      const value = Number(e.target.value);
      const time = (value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(value);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
  };

  const handleSkip = () => {
    setCurrentSong((prev) => (prev === songs.length - 1 ? 0 : prev + 1));
  };

  // Handle song end - play next song in circular fashion
  const handleSongEnd = () => {
    handleSkip();
  };

  const clearQueue = () => {
    // In a real app, this would clear the queue
    // For this demo, we'll just alert the user
    // alert("Queue cleared functionality would be implemented here");
    const currentlyPlaying = songs[currentSong];
    setSongs([currentlyPlaying]);
    setCurrentSong(0);
  };

  // Get the queue (all songs except the current one)
  const getQueue = () => {
    const queue = [...songs];
    // Move current song to the end to maintain circular queue visualization
    if (currentSong > 0) {
      const songsBeforeCurrent = queue.splice(0, currentSong);
      queue.push(...songsBeforeCurrent);
    }
    // Remove the first song (now playing)
    queue.shift();
    return queue;
  };

  if (songs.length === 0) {
    return <div>No songs available</div>;
  }

  return (
    <div className="p-3 rounded music-player">
      <audio
        ref={audioRef}
        src={songs[currentSong].url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnd}
        onError={(e) => {
          console.error("Audio error:", e);
          setError("Error loading audio. Please try another song.");
        }}
      />

      {error && <div className="text-danger text-center mb-3">{error}</div>}

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="m-0 fw-bold">Currently Playing:</h5>
        <div className="d-flex gap-2">
          <Button variant="outline-danger" className="rounded-circle">
            <Heart size={16} />
          </Button>
          <Button variant="light" className="rounded-pill" onClick={handleSkip}>
            Skip
          </Button>
        </div>
      </div>

      <Card className="mb-3 bg-light">
        <Card.Body className="p-2">
          <div className="d-flex align-items-center mb-2">
            <div
              className="me-2"
              style={{ width: "40px", height: "40px", position: "relative" }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                ALBUM
              </div>
            </div>
            <div className="flex-grow-1">
              <div className="fw-bold">{songs[currentSong].title}</div>
              <div className="text-muted">{songs[currentSong].artist}</div>
            </div>
            <div>
              <Button
                variant="link"
                className="p-1 me-1"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
            </div>
          </div>

          {/* Progress slider */}
          <Form.Range
            value={progress}
            onChange={handleProgressChange}
            className="mt-1"
          />

          {/* Volume control */}
          <div className="d-flex align-items-center mt-2">
            <Volume2 size={16} className="me-2 text-muted" />
            <Form.Range
              value={volume}
              onChange={handleVolumeChange}
              className="flex-grow-1"
              style={{ height: "20px" }}
            />
          </div>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="m-0 fw-bold">Queue:</h5>
        <Button
          variant="light"
          size="sm"
          className="rounded-pill"
          onClick={clearQueue}
        >
          Clear
        </Button>
      </div>

      <Stack gap={2}>
        {getQueue().map((song, index) => {
          const adjustedIndex = (currentSong + 1 + index) % songs.length;

          return (
            <Card
              key={index}
              className="bg-light"
              onClick={() => setCurrentSong(adjustedIndex)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body className="p-2">
                <div className="d-flex align-items-center">
                  <div
                    className="me-2"
                    style={{
                      width: "40px",
                      height: "40px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "10px",
                        textAlign: "center",
                      }}
                    >
                      ALBUM
                    </div>
                  </div>
                  <div>
                    <div className="fw-bold">{song.title}</div>
                    <div className="text-muted">{song.artist}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </Stack>
    </div>
  );
};

export default MusicPlayer;
