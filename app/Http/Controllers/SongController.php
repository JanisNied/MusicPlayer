<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SongController extends Controller
{
    public function index()
    {
        $songs = Song::where('user_id', Auth::id())->get();
        $playlists = Auth::user()->playlists()->with('songs')->get();
        
        return Inertia::render('Songs/Index', ['songs' => $songs, 'playlists' => $playlists]);
    }

    public function create()
    {
        return Inertia::render('Songs/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'artist' => 'required|string',
            'cover_image' => 'nullable|image',
            'file' => 'required|mimes:mp3,wav',
            'genres' => 'nullable|array',
        ]);

        $coverPath = $request->file('cover_image') ? $request->file('cover_image')->store('covers', 'public') : null;
        $filePath = $request->file('file')->store('songs', 'public');

        Song::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'artist' => $request->artist,
            'cover_image' => $coverPath,
            'file' => $filePath,
            'genres' => $request->genres,
        ]);

        return redirect()->route('songs.index');
    }
}
