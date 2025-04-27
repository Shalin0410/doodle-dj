import { useState, useRef, useEffect } from "react";
import { Button, Form, Card, Stack, Image } from "react-bootstrap";
import { Play, Pause, Volume2, Heart } from "lucide-react";
import "./MusicPlayer.css";

const MusicPlayer = ({ songs, setSongs, user, temp = false }) => {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [favorites, setFavorites] = useState([]);
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
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const API_URL =
          process.env.REACT_APP_API_URL || "http://localhost:5000";
        const response = await fetch(
          `${API_URL}/favorites?username=${user.email}`
        );
        const data = await response.json();

        if (response.ok) {
          setFavorites(data.favorites); // Store the favorites URLs
        } else {
          setError("Failed to fetch favorites.");
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("An error occurred while fetching favorites.");
      }
    };

    fetchFavorites();
    // eslint-disable-next-line
  }, []);

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

  const handleAddToFavorites = async (song) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/favorites/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.email,
          song: song,
        }),
      });

      const data = await response.json();
      console.log(data.message);

      if (response.ok) {
        setFavorites((prev) => [...prev, song]); // Add to local favorites
      } else {
        setError("Failed to add to favorites.");
      }
    } catch (err) {
      console.error("Error adding to favorites:", err);
      setError("An error occurred while adding to favorites.");
    }
  };

  const handleDeleteFromFavorites = async (song) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/favorites/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.email,
          preview_url: song.preview_url,
        }),
      });

      const data = await response.json();
      console.log(data.message);

      if (response.ok) {
        setFavorites((prev) =>
          prev.filter((favorite) => favorite.preview_url !== song.preview_url)
        ); // Remove from local favorites
        if (temp) {
          setSongs((prev) => prev.filter((s) => s.preview_url !== song.preview_url));
          setCurrentSong(0);
        }
      } else {
        setError("Failed to remove from favorites.");
      }
    } catch (err) {
      console.error("Error removing from favorites:", err);
      setError("An error occurred while removing from favorites.");
    }
  };

  if (songs.length === 0) {
    return <div>No songs available</div>;
  }

  return (
    <div className="p-3 rounded music-player">
      <audio
        ref={audioRef}
        src={songs[currentSong].preview_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnd}
        onError={(e) => {
          console.error("Audio error:", e);
          setError("Error loading audio. Please try another song.");
        }}
      />

      {error && <div className="text-danger text-center mb-3">{error}</div>}

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="m-0 fw-bold overflow-hidden">Currently Playing:</h5>
        <div className="d-flex gap-2 z-3">
          <Button
            variant="outline-danger"
            className="rounded-circle"
            onClick={() => {
              if (
                favorites.some(
                  (favorite) =>
                    favorite.preview_url === songs[currentSong].preview_url
                )
              ) {
                handleDeleteFromFavorites(songs[currentSong]);
              } else {
                handleAddToFavorites(songs[currentSong]);
              }
            }}
          >
            <Heart
              size={16}
              fill={
                favorites.some(
                  (favorite) =>
                    favorite.preview_url === songs[currentSong].preview_url
                )
                  ? "currentColor"
                  : "none"
              }
            />
          </Button>

          <Button variant="light" className="rounded-pill" onClick={handleSkip}>
            Skip
          </Button>
        </div>
      </div>

      <Card className="mb-3 bg-light">
        <Card.Body className="p-2">
          <div className="d-flex align-items-center mb-2">
            <div className="me-2">
              <Image
                src={songs[currentSong].image}
                alt="Album Art"
                style={{ width: "3rem", height: "3rem" }}
              />
            </div>
            <div className="flex-grow-1">
              <div className="fw-bold">{songs[currentSong].track_name}</div>
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
        <h5 className="m-0 fw-bold overflow-hidden">Queue:</h5>
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
                  <div className="me-2">
                    <Image
                      src={song.image}
                      alt="Album Art"
                      style={{ width: "3rem", height: "3rem" }}
                    />
                  </div>
                  <div>
                    <div className="fw-bold">{song.track_name}</div>
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
