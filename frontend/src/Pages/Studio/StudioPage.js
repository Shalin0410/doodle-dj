import redLogo from "../../Assets/redLogo.png";
import LogoutBtn from "../../Components/LogoutBtn/LogoutBtn";
import "./StudioPage.css";
import { useState } from "react";
import DrawingCanvas from "../../Components/DrawingCanvas/DrawingCanvas";
import MusicPlayer from "../../Components/MusicPlayer/MusicPlayer";

const currated_songs = [
  {
    title: "Ehu Girl",
    artist: "Kolohe Kai",
    url: "https://archive.org/download/opmskylerchase/Shehyee%20Maria%20Clara.mp3",
  },
  {
    title: "Walang Iba",
    artist: "Ezra Band",
    url: "https://archive.org/download/Filjohn/WALANG%20IBA%20by%20ezra%20band.mp3",
  },
  {
    title: "Maria Clara",
    artist: "Shehyee",
    url: "https://archive.org/download/opmskylerchase/Shehyee%20Maria%20Clara.mp3",
  },
  {
    title: "Gayuma",
    artist: "Abra (ft. Thyro & Jeriko Aguilar)",
    url: "https://archive.org/download/opmskylerchase/Shehyee%20Maria%20Clara.mp3",
  },
  {
    title: "Buko",
    artist: "Jireh Lim",
    url: "https://archive.org/download/opmskylerchase/Shehyee%20Maria%20Clara.mp3",
  },
];

const StudioPage = () => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrawingSubmit = async (imageData) => {
    setIsLoading(true);
    try {
      // TODO: Send the image data to the backend to get song recommendations
      setSongs(currated_songs); // Replace with actual song recommendations from the backend
    } catch (error) {
      console.error("Error getting song recommendations:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="studio-page container-fluid">
      <div className="row">
        <div className=" d-flex justify-content-between ">
          <div className="d-flex justify-content-between flex-column">
            <h1 className="logo">
              <div className="d-flex overflow-y-hidden">
                <img src={redLogo} style={{ width: "5rem" }} alt="Logo" />
                Doodle DJ
              </div>
            </h1>
          </div>
          <div className="me-5 mt-3">
            <LogoutBtn />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <DrawingCanvas onSubmit={handleDrawingSubmit} isLoading={isLoading} />
        </div>
        <div className="col-md-4 overflow-hidden">
          {songs.length === 0 ? (
            <div className="text-center mt-4 overflow-hidden">
              <h3 className="mb-3 overflow-hidden">
                Let your creativity flow.
              </h3>
              <p className="text-muted">
                Your next favourite song is just a doodle away.
              </p>
            </div>
          ) : (
            <MusicPlayer songs={songs} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
