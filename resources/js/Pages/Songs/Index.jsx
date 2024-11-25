import React from "react";
import { usePage } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import SongUpload from "@/Components/SongUpload";
import Dropdown from "@/Components/Dropdown";
import Playlists from "@/Components/Playlists";
import PlaylistCreation from "@/Components/PlaylistCreation";
import AddSongForm from "@/Components/AddSongToPlaylist";

export default function Index() {
    const { songs, playlists } = usePage().props;
    const user = usePage().props.auth.user;
    const [currentSongId, setCurrentSongId] = useState(songs[0]?.id || null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setisMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(() => {
        const savedVolume = localStorage.getItem("janisprojectvolume");
        return savedVolume !== null ? parseFloat(savedVolume) : 1;
    });
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);

    const currentSong = songs.find((song) => song.id === currentSongId) || {};
    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
    };
    const toggleMute = () => {
        setisMuted(!isMuted);
    };

    const toggleLoop = () => {
        setIsLooping(!isLooping);
    };
    useEffect(() => {
        const audio = audioRef.current;

        if (audio) {
            const updateTime = () => setCurrentTime(audio.currentTime);
            audio.addEventListener("timeupdate", updateTime);

            return () => {
                audio.removeEventListener("timeupdate", updateTime);
            };
        }
    }, [currentSongId]);

    useEffect(() => {
        localStorage.setItem("janisprojectvolume", volume);
    }, [volume]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio
                    .play()
                    .catch((error) =>
                        console.error("Error playing audio:", error)
                    );
            }
            setIsPlaying(!isPlaying);
        }
    };

    const nextSong = () => {
        if (isShuffle) {
            let randomSongId;
            do {
                randomSongId = songs[Math.floor(Math.random() * songs.length)].id;
            } while (randomSongId === currentSongId); 
            setCurrentSongId(randomSongId);
        } else {
            const currentIndex = songs.findIndex((song) => song.id === currentSongId);
            if (currentIndex < songs.length - 1) {
                setCurrentSongId(songs[currentIndex + 1].id);
            } else {
                setCurrentSongId(songs[0].id); 
            }
        }
    };
    
    const previousSong = () => {
        if (isShuffle) {
            let randomSongId;
            do {
                randomSongId = songs[Math.floor(Math.random() * songs.length)].id;
            } while (randomSongId === currentSongId); 
            setCurrentSongId(randomSongId);
        } else {
            const currentIndex = songs.findIndex((song) => song.id === currentSongId);
            if (currentIndex > 0) {
                setCurrentSongId(songs[currentIndex - 1].id);
            } else {
                setCurrentSongId(songs[songs.length - 1].id);
            }
        }
    };
    

    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        if (audio) {
            setDuration(audio.duration);
        }
    };

    const handleSeekChange = (e) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = e.target.value;
            setCurrentTime(e.target.value);
        }
    };

    const handleVolumeChange = (e) => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = e.target.value;
            setVolume(e.target.value);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio && currentSong.file) {
            audio.src = `/storage/${currentSong.file}`;
            audio.load();
            audio
                .play()
                .then(() => setIsPlaying(true))
                .catch((error) => console.error("Error playing audio:", error));
        }
    }, [currentSongId]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    const [isStyleChanged, setIsStyleChanged] = useState(false);

    const handleClick = () => {
        setIsStyleChanged(!isStyleChanged);
    };
    const [playlistMenu, setplaylistMenu] = useState(false);

    const handlePlaylistMenu = () => {
        setplaylistMenu(!playlistMenu);
    };

    const [isHome, setIsHome] = useState(true);
    const homeToggle = (e, state) => {
        setIsHome(state);
    };

    const [addSong, setAddSong] = useState(false);
    const songToggle = () => {
        setAddSong(!addSong);
    };
    
    return (
        <>
            <audio
                ref={audioRef}
                src={`/storage/${currentSong.file}`}
                onEnded={nextSong}
                preload="auto"
                hidden={!currentSong.file}
                onLoadedMetadata={handleLoadedMetadata}
                loop={isLooping}
                muted={isMuted}
            />

            <meta charSet="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <title>Music Player</title>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
            />
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
            />
            <link rel="stylesheet" href="/css/mainstyle.css" />
            <div
                className="uploadingSong song-list-item"
                style={{ display: playlistMenu ? "flex" : "none" }}
            >
                <PlaylistCreation />
                <button onClick={handlePlaylistMenu}>Exit</button>
            </div>
            <div
                className="uploadingSong song-list-item"
                style={{ display: isStyleChanged ? "flex" : "none" }}
            >
                <SongUpload />
                <button onClick={handleClick}>Exit</button>
            </div>
            <div className="uploadingSong song-list-item" style={{ display: addSong ? "flex" : "none" }}>
                        <AddSongForm
                            playlists={playlists}
                            song={songs.find(
                                (song) => song.id === currentSongId
                            )}
                            onAddSong={(playlistId, songId) =>
                                axios
                                    .post(
                                        route("playlists.addSong", {
                                            playlist: playlistId,
                                        }),
                                        { song_id: songId }
                                    )
                                    .then((response) => {
                                        console.log(
                                            "Song added successfully:",
                                            response.data
                                        );

                                        setPlaylists((prevPlaylists) =>
                                            prevPlaylists.map((playlist) =>
                                                playlist.id === playlistId
                                                    ? {
                                                          ...playlist,
                                                          songs: [
                                                              ...playlist.songs,
                                                              response.data
                                                                  .song,
                                                          ],
                                                      }
                                                    : playlist
                                            )
                                        );
                                    })
                                    .catch((error) => {
                                        console.error(
                                            "Error adding song:",
                                            error.response?.data?.message
                                        );
                                    })
                            }
                        />
                        <button onClick={songToggle}>Exit</button>
            </div>
            <div className="body">
                <header>
                    <div className="container flex justify-between align-center flex-shrink">
                        <p>
                            <span className="titleColor1">Music</span>Player
                        </p>
                        <form action="#" id="searchBar" className="flex">
                            <i className="ti ti-search"></i>
                            <input
                                type="text"
                                name="search"
                                id="searchField"
                                placeholder=" Artists, songs or genres"
                                size="50"
                            />
                        </form>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <div
                                    className="flex justify-end align-center"
                                    style={{ cursor: "pointer" }}
                                >
                                    <p className="greeting">{user.name}</p>
                                    <div className="profilePictureFrame">
                                        <div className="profilePicture"></div>
                                    </div>
                                </div>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route("profile.edit")}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>
                <main>
                    <div className="container flex justify-between">
                        <aside>
                            <ul className="side-nav">
                                <li
                                    id="songs-button"
                                    className={isHome ? "navSelected" : ""}
                                    onClick={(e) => {
                                        homeToggle(e, true);
                                    }}
                                >
                                    <i className="fa-solid fa-music"></i> All
                                    Songs
                                </li>
                                <li
                                    className={isHome ? "" : "navSelected"}
                                    id="playlists-button"
                                    onClick={(e) => {
                                        homeToggle(e, false);
                                    }}
                                >
                                    <i className="ti ti-books"></i> Playlists
                                </li>
                            </ul>
                            <hr />
                            <ul className="side-nav">
                                <li onClick={handlePlaylistMenu}>
                                    <i className="ti ti-circle-plus"></i> Create
                                    Playlist
                                </li>
                                <li onClick={handleClick}>
                                    <i className="ti ti-upload"></i> Upload Song
                                </li>
                            </ul>
                            <hr />
                            <ul className="side-nav">
                                <li>
                                    <i className="ti ti-heart"></i> Liked Songs
                                </li>
                            </ul>
                            <div className="copyright" />
                        </aside>
                        <section
                            id="allSongs"
                            style={
                                isHome
                                    ? { display: "none" }
                                    : { display: "block" }
                            }
                        >
                            <Playlists
                                playlists={playlists}
                                currentSongId={currentSongId}
                                setCurrentSongId={setCurrentSongId}
                            />
                        </section>
                        <section
                            id="allSongs"
                            style={
                                isHome
                                    ? { display: "block" }
                                    : { display: "none" }
                            }
                        >
                            <h2>All Songs</h2>
                            <div className="flex playlist-flex playlistContainer">
                                <ul>
                                    {songs.map((song, index) => (
                                        <li
                                            key={song.id}
                                            onClick={() =>
                                                setCurrentSongId(song.id)
                                            }
                                            className="song-list-item"
                                            style={{
                                                cursor: "pointer",
                                                fontWeight:
                                                    song.id === currentSongId
                                                        ? "bold"
                                                        : "normal",
                                                backgroundColor:
                                                    song.id === currentSongId
                                                        ? "#f0f0f0"
                                                        : "transparent",
                                                border:
                                                    song.id === currentSongId
                                                        ? "0.1rem solid var(--mainColor)"
                                                        : "none",
                                                animationDelay: `${
                                                    index * 0.03
                                                }s`,
                                                zIndex: "-100",
                                            }}
                                        >
                                            <div className="flex justify-between align-center">
                                                <div className="flex playlist-flex">
                                                    <div>
                                                        {}
                                                        {song.cover_image && (
                                                            <div
                                                                className="img"
                                                                style={{
                                                                    borderRadius:
                                                                        ".5rem",
                                                                    objectFit:
                                                                        "cover",
                                                                    width: "5rem",
                                                                    height: "5rem",
                                                                    backgroundImage: `url(/storage/${song.cover_image})`,
                                                                    backgroundSize:
                                                                        "cover",
                                                                    backgroundRepeat:
                                                                        "no-repeat",
                                                                    backgroundPosition:
                                                                        "center center",
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p>
                                                            {song.title}
                                                            <br></br>
                                                            {song.artist}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        textAlign: "right",
                                                        display: "flex",
                                                        columnGap: "1rem",
                                                    }}
                                                >
                                                    <p>
                                                        {new Date(
                                                            song.created_at
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* {currentIndex === index && isPlaying && <span> - Playing</span>} */}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </div>
                </main>
                <footer className="flex justify-between">
                    <div id="songinfo" className="flex">
                        <div id="imgthumbnail">
                            {currentSong.cover_image && (
                                <div
                                    className="img"
                                    style={{
                                        backgroundImage: `url(/storage/${currentSong.cover_image})`,
                                    }}
                                />
                            )}
                        </div>
                        <div>
                            <div className="flex align-center">
                                <h3>{currentSong.title}</h3>
                                <button id="heartSong">
                                    <i className="ti ti-heart"></i>
                                </button>
                                <button id="playlistSettings">
                                <i className="fa-solid fa-plus" onClick={songToggle}></i>
                                </button>
                            </div>
                            <p>{currentSong.artist}</p>
                        </div>
                    </div>
                    <div
                        id="musicControl"
                        className="flex align-center direction-column"
                    >
                        <div id="controlPanel" className="flex controlFlex">
                            <button id="shuffle" onClick={toggleShuffle} style={{color: (isShuffle) ? "var(--mainColor)" : ""}}>
                                <i className="ti ti-arrows-shuffle"></i>
                            </button>
                            <button id="prevSong" onClick={previousSong}>
                                <i className="ti ti-player-track-prev"></i>
                            </button>
                            <button id="playBtn" onClick={togglePlay}>
                                <i
                                    className={
                                        isPlaying
                                            ? "ti ti-player-pause"
                                            : "ti ti-player-play"
                                    }
                                ></i>
                            </button>
                            <button id="nextSong" onClick={nextSong}>
                                <i className="ti ti-player-track-next"></i>
                            </button>
                            <button id="repeat" onClick={toggleLoop} style={{color: (isLooping) ? "var(--mainColor)" : ""}}>
                                <i className="ti ti-repeat"></i>
                            </button>
                        </div>
                        <div id="seekBar">
                            <form
                                className="flex align-center playlist-flex"
                                style={{ flexShrink: 0 }}
                            >
                                <p>{formatTime(currentTime)}</p>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={currentTime}
                                    onChange={handleSeekChange}
                                    disabled={!audioRef.current}
                                />
                                <p>
                                    {audioRef.current
                                        ? formatTime(
                                              audioRef.current.duration
                                          ) == "NaN:NaN"
                                            ? "0:00"
                                            : formatTime(
                                                  audioRef.current.duration
                                              )
                                        : "0:00"}
                                </p>
                            </form>
                        </div>
                    </div>
                    <div id="volume">
                        <form className="flex align-center">
                            <div id="volume" onClick={toggleMute}>
                                <i className={isMuted ? "ti ti-volume-3" : "ti ti-volume"}></i>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                            />
                        </form>
                    </div>
                </footer>
            </div>
        </>
    );
}
