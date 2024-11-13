import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function SongUpload({ onSuccess }) {
    const { data, setData, post, progress, reset } = useForm({
        title: '',
        artist: '',
        cover_image: null,
        file: null,
        genres: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('songs.store'), {
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="song-upload-form">
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Artist:</label>
                <input
                    type="text"
                    value={data.artist}
                    onChange={(e) => setData('artist', e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Cover Image:</label>
                <input
                    type="file"
                    onChange={(e) => setData('cover_image', e.target.files[0])}
                    accept="image/*"
                />
            </div>
            <div>
                <label>Audio File:</label>
                <input
                    type="file"
                    onChange={(e) => setData('file', e.target.files[0])}
                    accept="audio/*"
                    required
                />
            </div>
            <div>
                <label>Genres (comma separated):</label>
                <input
                    type="text"
                    value={data.genres}
                    onChange={(e) => setData('genres', e.target.value.split(','))}
                />
            </div>
            <button type="submit">Upload Song</button>
            {progress && <progress value={progress.percentage} max="100">{progress.percentage}%</progress>}
        </form>
    );
}
