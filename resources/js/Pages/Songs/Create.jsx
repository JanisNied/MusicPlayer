import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, progress } = useForm({
        title: '',
        artist: '',
        cover_image: null,
        file: null,
        genres: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('songs.store'));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Title" required />
            <input type="text" value={data.artist} onChange={e => setData('artist', e.target.value)} placeholder="Artist" required />
            <input type="file" onChange={e => setData('cover_image', e.target.files[0])} accept="image/*" />
            <input type="file" onChange={e => setData('file', e.target.files[0])} accept="audio/*" required />
            <input type="text" value={data.genres} onChange={e => setData('genres', e.target.value.split(','))} placeholder="Genres (comma separated)" />
            <button type="submit">Upload Song</button>
            {progress && <progress value={progress.percentage} max="100">{progress.percentage}%</progress>}
        </form>
    );
}
