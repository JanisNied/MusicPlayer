<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;

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
    public function edit(Song $song)
    {
        if ($song->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Songs/Edit', [
            'song' => $song,
        ]);
    }
    public function update(Request $request, Song $song)
    {
        if ($song->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string',
            'artist' => 'required|string',
            'cover_image' => 'nullable|image',
            'file' => 'nullable|mimes:mp3,wav',
            'genres' => 'nullable|array',
        ]);

        if ($request->file('cover_image')) {
            if ($song->cover_image) {
                Storage::disk('public')->delete($song->cover_image);
            }
            $song->cover_image = $request->file('cover_image')->store('covers', 'public');
        }

        if ($request->file('file')) {
            if ($song->file) {
                Storage::disk('public')->delete($song->file);
            }
            $song->file = $request->file('file')->store('songs', 'public');
        }

        $song->update([
            'title' => $request->title,
            'artist' => $request->artist,
            'genres' => $request->genres,
        ]);

        return redirect()->route('songs.index');
    }
    public function destroy(Song $song)
    {
        if ($song->user_id !== Auth::id()) {
            abort(403);
        }
        if ($song->cover_image) {
            Storage::disk('public')->delete($song->cover_image);
        }
        if ($song->file) {
            Storage::disk('public')->delete($song->file);
        }

        $song->delete();

        return redirect()->route('songs.index');
    }

}
