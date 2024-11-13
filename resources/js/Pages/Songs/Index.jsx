import React from "react";
import { usePage } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import SongUpload from "@/Components/SongUpload";
import Dropdown from "@/Components/Dropdown";

export default function Index() {
    const { songs } = usePage().props;
    const user = usePage().props.auth.user;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;

        if (audio) {
            const updateTime = () => setCurrentTime(audio.currentTime);
            audio.addEventListener("timeupdate", updateTime);

            return () => {
                audio.removeEventListener("timeupdate", updateTime);
            };
        }
    }, [currentIndex]);

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
        if (currentIndex < songs.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };
    const previousSong = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(songs.length - 1);
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
    const currentSong = songs[currentIndex] || {};

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
    }, [currentIndex]);
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };
    const [isStyleChanged, setIsStyleChanged] = useState(false);

    const handleClick = () => {
        setIsStyleChanged(!isStyleChanged);
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
                className="uploadingSong"
                style={{ display: isStyleChanged ? "flex" : "none" }}
            >
                <SongUpload />
                <button onClick={handleClick}>Exit</button>
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
                                <li>
                                    <i className="fa-solid fa-music"></i> Home
                                </li>
                                <li className="navSelected">
                                    <i className="ti ti-books"></i> My Library
                                </li>
                            </ul>
                            <hr />
                            <ul className="side-nav">
                                <li>
                                    <i className="ti ti-circle-plus"></i> Create
                                    Playlist
                                </li>
                                <li>
                                    <i className="ti ti-heart"></i> Liked Songs
                                </li>
                            </ul>
                            <hr />
                            <ul className="side-nav">
                                <li onClick={handleClick}>
                                    <i className="ti ti-upload"></i> Upload Song
                                </li>
                            </ul>
                            <div className="copyright" />
                        </aside>
                        <section>
                            <h2>Library</h2>
                            <div
                                className="flex playlist-flex"
                                id="playlistContainer"
                            >
                                <ul>
                                    {songs.map((song, index) => (
                                        <li
                                            key={song.id}
                                            onClick={() =>
                                                setCurrentIndex(index)
                                            }
                                            style={{
                                                cursor: "pointer",
                                                fontWeight:
                                                    currentIndex === index
                                                        ? "bold"
                                                        : "normal",
                                                backgroundColor:
                                                    currentIndex === index
                                                        ? "#f0f0f0"
                                                        : "transparent",
                                                border:
                                                    currentIndex === index
                                                        ? "0.1rem solid var(--mainColor)"
                                                        : "none",
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
                                                <div>
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
                            </div>
                            <p>{currentSong.artist}</p>
                        </div>
                    </div>
                    <div
                        id="musicControl"
                        className="flex align-center direction-column"
                    >
                        <div id="controlPanel" className="flex controlFlex">
                            <button id="shuffle">
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
                            <button id="repeat">
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
                            <button id="volume">
                                <i className="ti ti-volume"></i>
                            </button>
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
