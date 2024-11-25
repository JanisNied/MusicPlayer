import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function PlaylistCreation({ onSuccess }) {
    const { data, setData, post, progress, reset } = useForm({
        name: '',
        description: '',
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('image', data.image);

        post(route('playlists.store'), {
            data: formData,
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
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
                <label>Image:</label>
                <input
                    type="file"
                    onChange={(e) => setData('image', e.target.files[0])}
                    accept="image/*"
                />
            </div>
            <button className='song-list-item' style={{animationDelay: "0.16s"}} type="submit">Create Playlist</button>
        </form>
    );
}
