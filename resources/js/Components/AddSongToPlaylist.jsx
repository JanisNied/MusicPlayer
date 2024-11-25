import React, { useState } from "react";
import { Inertia } from '@inertiajs/inertia';

const AddSongToPlaylist = ({ playlists, song }) => {
    const [showPlaylists, setShowPlaylists] = useState(false);

    const handleAddSong = (playlistId) => {
        try {
            Inertia.post(route("playlists.addSong", { playlist: playlistId }), {
                song_id: song.id,
            });
            setShowPlaylists(false); 
        } catch (error) {
            console.error("Error adding song:", error.response?.data?.message);
        }
    };
    const eligiblePlaylists = playlists.filter(
        (playlist) => !playlist.songs.some((s) => s.id === song.id)
    );

    return (
        <>
            <button onClick={() => setShowPlaylists(!showPlaylists)} className="button-custom song-list-item">
                {showPlaylists ? "Hide Playlists" : "Add to Playlist"}
            </button>
            {showPlaylists && (
                <ul
                    style={{
                        listStyle: "none",
                        margin: "0.5rem 0",
                        padding: "0.2rem",
                        border: "1px solid #ccc",
                        borderRadius: "0.5rem",
                        maxHeight: "10rem",
                        overflowY: "auto",
                        zIndex: "100",
                        background: "#fff",
                    }}
                >
                    {eligiblePlaylists.length > 0 ? (
                        eligiblePlaylists.map((playlist) => (
                            <li
                                key={playlist.id}
                                style={{
                                    padding: "0.5rem",
                                    borderBottom: "1px solid #eee",
                                    cursor: "pointer",
                                    zIndex: "50"
                                }}
                                className="playlistThingy"
                                onClick={() => handleAddSong(playlist.id)}
                            >
                                {playlist.name}
                            </li>
                        ))
                    ) : (
                        <li style={{ padding: "0.5rem", color: "#888", pointerEvents: "none" }}>
                            This song is already in all playlists.
                        </li>
                    )}
                </ul>
            )}
        </>
    );
};

export default AddSongToPlaylist;
