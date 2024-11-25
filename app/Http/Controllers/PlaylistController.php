<?php

namespace App\Http\Controllers;

use App\Models\Song;
use App\Models\Playlist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

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
            Redirect::route('songs.index');
        }
        
        $playlist->songs()->attach($validated['song_id']);

        $song = Song::find($validated['song_id']);
        return redirect()->route('songs.index');
    }

    public function destroy(Playlist $playlist)
    {
        if ($playlist->user_id !== Auth::id()) {
            abort(403);
        }
        if ($playlist->image) {
            Storage::disk('public')->delete($playlist->image);
        }

        $playlist->delete();

        return redirect()->route('songs.index');
    }
    // public function edit(Playlist $playlist)
    // {
    //     if ($playlist->user_id !== Auth::id()) {
    //         abort(403);
    //     }

    //     return Inertia::render('Songs/Edit', [
    //         'playlist' => $playlist,
    //     ]);
    // }
    public function update(Request $request, Playlist $playlist)
{
    if ($playlist->user_id !== Auth::id()) {
        abort(403);
    }

    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'image' => 'nullable|image',
    ]);

    if ($request->file('image')) {
        if ($playlist->image) {
            Storage::disk('public')->delete($playlist->image);
        }
        $playlist->image = $request->file('image')->store('playlists', 'public');
    }

    $playlist->update([
        'name' => $request->name,
        'description' => $request->description,
    ]);

    return redirect()->route('songs.index');
}
}
