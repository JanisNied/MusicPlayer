import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function SongEdit({ song }) {
    const [showPlaylists, setShowPlaylists] = useState(false);

    const { data, setData, put, errors } = useForm({
        title: song.title,
        artist: song.artist,
        cover_image: null,
        file: null,
        genres: song.genres || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("songs.update", song.id));
    };

    return (
        <>
        <button onClick={() => setShowPlaylists(!showPlaylists)} className="button-custom song-list-item">
                {showPlaylists ? "Hide Edit Song Menu" : "Edit Song"}
            </button>
            {showPlaylists && (
                <form onSubmit={handleSubmit} className="song-upload-form">
                <div className='song-list-item' style={{animationDelay: "0.1s"}}>
                <label>Title:</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                    />
                </div>
                <div className='song-list-item' style={{animationDelay: "0.12s"}}>
                <label>Artist:</label>
                    <input
                        type="text"
                        value={data.artist}
                        onChange={(e) => setData("artist", e.target.value)}
                    />
                </div>
                {/* <div className='song-list-item' style={{animationDelay: "0.14s"}}>
                    <label>Cover Image:</label>
                    <input
                        type="file"
                        onChange={(e) => setData('cover_image', e.target.files[0])}
                        accept="image/*"
                    />
                </div>
                <div className='song-list-item' style={{animationDelay: "0.16s"}}>
                    <label>Audio File:</label>
                    <input
                        type="file"
                        onChange={(e) => setData('file', e.target.files[0])}
                        accept="audio/*"
                    />
                </div> */} {/* doesn't work for whatever reason */}
                <div className='song-list-item' style={{animationDelay: "0.14s"}}>
                    <label>Genres (comma separated):</label>
                    <input
                        type="text"
                        value={data.genres}
                        onChange={(e) => setData('genres', e.target.value.split(','))}
                    />
                </div>
                <button className='song-list-item' style={{animationDelay: "0.16s"}} type="submit">Save Changes</button>
                {/* {progress && <progress value={progress.percentage} max="100">{progress.percentage}%</progress>} */}
            </form>
            )}
        </>
        
    );
}
