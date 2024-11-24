<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'title', 'artist', 'cover_image', 'file', 'genres'];

    protected $casts = [
        'genres' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function playlists()
    {
        return $this->belongsToMany(Playlist::class, 'playlist_song');
    }

}
