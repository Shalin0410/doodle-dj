import redLogo from "../../Assets/redLogo.png";
// import LogoutBtn from "../../Components/LogoutBtn/LogoutBtn";
import "./StudioPage.css";
import { useState, useEffect } from "react";
import DrawingCanvas from "../../Components/DrawingCanvas/DrawingCanvas";
import MusicPlayer from "../../Components/MusicPlayer/MusicPlayer";
import { auth } from "../../firebaseConfig";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";

const StudioPage = () => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  const handleDrawingSubmit = async (imageData) => {
    setIsLoading(true);
    try {
      // const response = await fetch("http://localhost:5001/get-songs", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Access-Control-Allow-Origin": "*",
      //   },
      //   body: JSON.stringify({ image: imageData }),
      // });
      // const data = await response.json();

      const data = {
        message: "Keywords extracted and sent to Deezer.",
        keywords: "main character energy",
        results: [
          {
            track_name: "Main Character Energy",
            artist: "Bella International",
            album: "Main Character Energy",
            preview_url:
              "https://cdnt-preview.dzcdn.net/api/1/1/5/8/b/0/58bbe08f6e97515a8f9acd878cc8cf8a.mp3?hdnea=exp=1744692467~acl=/api/1/1/5/8/b/0/58bbe08f6e97515a8f9acd878cc8cf8a.mp3*~data=user_id=0,application_id=42~hmac=9bbcb50b35b260194c37e4a71bb3ea13b52e7050baa0fb999bb7f524e5ebfa12",
            embed_url: "https://widget.deezer.com/widget/dark/track/3117673271",
            external_url: "https://www.deezer.com/track/3117673271",
            image:
              "https://cdn-images.dzcdn.net/images/cover/51cc5f7290ff52a6bad7039d389c5b76/250x250-000000-80-0-0.jpg",
          },
          {
            track_name: "Main Character Energy",
            artist: "Moonlight Scorpio",
            album: "Main Character Energy",
            preview_url:
              "https://cdnt-preview.dzcdn.net/api/1/1/6/b/3/0/6b375ead9eb7ab2e981e11a765b7ef5b.mp3?hdnea=exp=1744692467~acl=/api/1/1/6/b/3/0/6b375ead9eb7ab2e981e11a765b7ef5b.mp3*~data=user_id=0,application_id=42~hmac=a070cb82d4ba359b283004682c62a8410873a6c513ffef0fd5297651af0480fa",
            embed_url: "https://widget.deezer.com/widget/dark/track/3215337271",
            external_url: "https://www.deezer.com/track/3215337271",
            image:
              "https://cdn-images.dzcdn.net/images/cover/524b53b6834468af98a4e50ea86c38ef/250x250-000000-80-0-0.jpg",
          },
          {
            track_name: "Main Character Energy",
            artist: "Sarah, the Illstrumentalist",
            album: "Golden Skin",
            preview_url:
              "https://cdnt-preview.dzcdn.net/api/1/1/a/e/f/0/aefc4a51c38b697aa16658d68743889b.mp3?hdnea=exp=1744692467~acl=/api/1/1/a/e/f/0/aefc4a51c38b697aa16658d68743889b.mp3*~data=user_id=0,application_id=42~hmac=c36edc6245e7b222d7be9684da204b6c96f5bcb109a79f923aebb702a6a8c9c4",
            embed_url: "https://widget.deezer.com/widget/dark/track/1678354647",
            external_url: "https://www.deezer.com/track/1678354647",
            image:
              "https://cdn-images.dzcdn.net/images/cover/c0249b3bb8c1243249af2ee46de2047a/250x250-000000-80-0-0.jpg",
          },
          {
            track_name: "Fortnite Song",
            artist: "Danergy",
            album: "Fortnite Song",
            preview_url:
              "https://cdnt-preview.dzcdn.net/api/1/1/5/a/8/0/5a8447f065f951e6509f8e691e1e70c5.mp3?hdnea=exp=1744692467~acl=/api/1/1/5/a/8/0/5a8447f065f951e6509f8e691e1e70c5.mp3*~data=user_id=0,application_id=42~hmac=3394694cead437d7d21296c5896a8a4a678e2ed7149778ec0672f38505749263",
            embed_url: "https://widget.deezer.com/widget/dark/track/3273419011",
            external_url: "https://www.deezer.com/track/3273419011",
            image:
              "https://cdn-images.dzcdn.net/images/cover/1087237c043ac0dfcef6b2ff8b4b1f5c/250x250-000000-80-0-0.jpg",
          },
          {
            track_name: "Main Character Energy (feat. Kimera)",
            artist: "AlishaVulkano",
            album: "Main Character Energy (feat. Kimera)",
            preview_url:
              "https://cdnt-preview.dzcdn.net/api/1/1/6/c/c/0/6cc12e68f3a169c0fb1dd2031bfdf4c9.mp3?hdnea=exp=1744692467~acl=/api/1/1/6/c/c/0/6cc12e68f3a169c0fb1dd2031bfdf4c9.mp3*~data=user_id=0,application_id=42~hmac=2d57d7cf2259239c9d4943b34f9f70e395bd426649ca683bbfb7b4c71d0780a6",
            embed_url: "https://widget.deezer.com/widget/dark/track/3295541271",
            external_url: "https://www.deezer.com/track/3295541271",
            image:
              "https://cdn-images.dzcdn.net/images/cover/f413a749e749f29247900da6c7283924/250x250-000000-80-0-0.jpg",
          },
        ],
      };
      const songs = data.results || [];
      setSongs(songs.length ? songs : []);
    } catch (error) {
      console.error("Error getting song recommendations:", error);
    }
    setIsLoading(false);
  };

  console.log(songs);
  return (
    <div className="studio-page container-fluid">
      <div className="row">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-between flex-column">
            <h1 className="logo">
              <div className="d-flex overflow-y-hidden">
                <img src={redLogo} style={{ width: "5rem" }} alt="Logo" />
                Doodle DJ
              </div>
            </h1>
          </div>

          <div className="me-5 mt-3 d-flex align-items-center gap-3">
            {user && (
              <div>
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    className="d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm border border-1"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "50%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                    <span>{user.displayName}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="email-tooltip">{user.email}</Tooltip>
                      }
                    >
                      <Dropdown.Item disabled className="text-muted">
                        {user.email.length > 22
                          ? user.email.slice(0, 22) + "..."
                          : user.email}
                      </Dropdown.Item>
                    </OverlayTrigger>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#" onClick={() => auth.signOut()}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row" style={{ marginTop: "-4rem" }}>
        <div className="col-md-8">
          <DrawingCanvas onSubmit={handleDrawingSubmit} isLoading={isLoading} />
        </div>
        <div className="col-md-4 overflow-hidden d-flex flex-column align-items-center justify-content-center">
          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center flex-column"
              style={{ height: "100%" }}
            >
              <div className="spinner-border " role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">
                Finding the perfect track for your doodle...
              </p>
            </div>
          ) : songs.length === 0 ? (
            <div className="text-center mt-4 overflow-hidden song-list-color">
              <p
                className="mb-3 overflow-hidden song-list"
                style={{ fontSize: "3vw" }}
              >
                Let your creativity flow.
              </p>
              <p className="song-list" style={{ fontSize: "1.5vw" }}>
                Your next favorite song is just a doodle away.
              </p>
            </div>
          ) : (
            <MusicPlayer songs={songs} setSongs={setSongs} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
