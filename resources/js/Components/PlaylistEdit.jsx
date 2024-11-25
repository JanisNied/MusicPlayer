import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function PlaylistEdit({ playlist }) {
    const [showPlaylists, setShowPlaylists] = useState(false);

    const { data, setData, put, errors } = useForm({
        name: playlist.name,
        description: playlist.description,
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("playlists.update", playlist.id));
    };

    return (
        <>
        <button onClick={() => setShowPlaylists(!showPlaylists)} className="button-custom song-list-item">
                {showPlaylists ? "Hide Edit Playlist Menu" : "Edit Playlist"}
            </button>
            {showPlaylists && (
                <form onSubmit={handleSubmit} className="playlist-creation-form">
                <div className='song-list-item' style={{animationDelay: "0.1s"}}>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                </div>
                <div className='song-list-item'  style={{display: "flex", alignItems: 'center', animationDelay: "0.12s"}}>
                    <label>Description:</label>
                    <textarea
                    style={{borderRadius: "0.5rem", resize: "none", border: ".1rem solid black"}}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                </div>
                <div className='song-list-item' style={{animationDelay: "0.14s"}}>
                    {/* <label>Image:</label>
                    <input
                        type="file"
                        onChange={(e) => setData('image', e.target.files[0])}
                        accept="image/*"
                    /> */}
                </div>
                <button className='song-list-item' style={{animationDelay: "0.14s"}} type="submit">Save Playlist</button>
            </form>
            )}
        </>
        
    );
}
