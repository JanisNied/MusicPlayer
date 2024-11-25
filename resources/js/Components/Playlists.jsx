import React, { useState } from "react";

export default function Playlists({
    playlists,
    currentSongId,
    setCurrentSongId,
}) {
    const [isPlaylist, setisPlaylist] = useState(false);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

    const handlePlaylistClick = (playlistId) => {
        setSelectedPlaylistId(
            selectedPlaylistId === playlistId ? null : playlistId
        );
        setisPlaylist(true);
    };

    const returnToPlaylist = () => {
        setSelectedPlaylistId(null);
        setisPlaylist(false);
    };

    const selectedPlaylist = playlists.find(
        (playlist) => playlist.id === selectedPlaylistId
    );

    const handleSongClick = (songId) => {
        setCurrentSongId(songId);
    };

    if (!playlists || playlists.length === 0) {
        return <p>No playlists available.</p>;
    }

    return (
        <>
            <h2 style={{ display: isPlaylist ? "none" : "block" }}>Playlists</h2>
            <h2
                id="returnBtn"
                style={{ display: isPlaylist ? "inline" : "none", cursor: "pointer" }}
                onClick={returnToPlaylist}
            >
                <i className="fa-solid fa-arrow-left"></i> Return to Playlists
            </h2>
            <div className="flex playlist-flex playlistContainer">
                <ul
                    className="playlist-flex direction-column"
                    style={{ display: isPlaylist ? "none" : "block" }}
                >
                    {playlists.map((playlist, index) => (
                        <li
                            key={playlist.id}
                            className="newPlaylistElement song-list-item"
                            onClick={() => handlePlaylistClick(playlist.id)}
                            style={{
                                animationDelay: `${index * 0.03}s`,
                            }}
                        >
                            {playlist.image && (
                                <div
                                    style={{
                                        width: "5rem",
                                        height: "5rem",
                                        background: `url(/storage/${playlist.image})`,
                                        backgroundPosition: "center center",
                                        float: "left",
                                        borderRadius: "0.5rem",
                                        marginRight: "0.5rem",
                                    }}
                                    alt={playlist.name}
                                />
                            )}
                            <div className="flex justify-between">
                                <div>
                                    <h2
                                        style={{
                                            fontSize: "1.2rem",
                                            marginBottom: "0rem",
                                        }}
                                    >
                                        {playlist.name}
                                    </h2>
                                    <p>{playlist.description}</p>
                                </div>
                                <div></div>
                            </div>
                        </li>
                    ))}
                </ul>
                {selectedPlaylist && (
                    <ul style={{ display: isPlaylist ? "display" : "none" }}>
                        <li className="newPlaylistElement" id="playlistHead">
                            {selectedPlaylist.image && (
                                <div
                                    style={{
                                        width: "5rem",
                                        height: "5rem",
                                        background: `url(/storage/${selectedPlaylist.image})`,
                                        backgroundPosition: "center center",
                                        float: "left",
                                        borderRadius: "0.5rem",
                                        marginRight: "0.5rem",
                                    }}
                                    alt={selectedPlaylist.name}
                                />
                            )}
                            <div className="flex justify-between" id="playlistdata" >
                                <div>
                                    <h2
                                        style={{
                                            fontSize: "1.2rem",
                                            marginBottom: "0rem",
                                        }}
                                    >
                                        {selectedPlaylist.name}
                                    </h2>
                                    <p>{selectedPlaylist.description}</p>
                                </div>
                                <div>
                                    <p>
                                        {new Date(
                                            selectedPlaylist.created_at
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                    <p>
                                        {(selectedPlaylist.songs.length <= 0) ? "No songs" : ((selectedPlaylist.songs.length > 1) ? `${selectedPlaylist.songs.length} songs` : `${selectedPlaylist.songs.length} song`)}
                                    </p>
                                </div>
                            </div>
                        </li>
                        {selectedPlaylist.songs.map((song) => (
                            <li
                                key={song.id}
                                onClick={() => handleSongClick(song.id)}
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
                                    animationDelay: `${selectedPlaylist.songs.indexOf(song) * 0.03}s`,
                                }}
                            >
                                <div className="flex justify-between align-center">
                                    <div className="flex playlist-flex">
                                        <div>
                                            {song.cover_image && (
                                                <div
                                                    className="img"
                                                    style={{
                                                        borderRadius: ".5rem",
                                                        objectFit: "cover",
                                                        width: "5rem",
                                                        height: "5rem",
                                                        backgroundImage: `url(/storage/${song.cover_image})`,
                                                        backgroundSize: "cover",
                                                        backgroundRepeat: "no-repeat",
                                                        backgroundPosition: "center center",
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p>
                                                {song.title}
                                                <br />
                                                {song.artist}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>
                                            {new Date(
                                                song.created_at
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
