<?php

namespace App\Http\Controllers;

use App\Models\Song;
use App\Models\Playlist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PlaylistController extends Controller
{
    public function index()
    {
        $songs = Song::where('user_id', Auth::id())->get();
        $playlists = Auth::user()->playlists()->with('songs')->get();
        
        return Inertia::render('Songs/Index', ['songs' => $songs, 'playlists' => $playlists]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image',
        ]);
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('playlists/images', 'public');
        }
        
        Auth::user()->playlists()->create([
            'name' => $request->name,
            'description' => $request->description,
            'image' => $imagePath,
        ]);

        return redirect()->route('songs.index');
    }

    public function addSong(Request $request, Playlist $playlist)
    {
        $validated = $request->validate([
            'song_id' => 'required|exists:songs,id',
        ]);
    

        if ($playlist->user_id !== Auth::id()) {
            abort(403);
        }

        if ($playlist->songs()->where('songs.id', $validated['song_id'])->exists()) {
            redirect()->route('playlists.index');
        }
        
        $playlist->songs()->attach($validated['song_id']);

        $song = Song::find($validated['song_id']);
        return redirect()->route('songs.index');
    }
}
