<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SongController;
use App\Http\Controllers\PlaylistController;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

Route::get('/dashboard', function () {
    return redirect()->route('songs.index');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/player', [SongController::class, 'index'])->name('songs.index');
    Route::get('/player/create', [SongController::class, 'create'])->name('songs.create');
    Route::post('/player', [SongController::class, 'store'])->name('songs.store');

    // Route::get('/player/{song}/edit', [SongController::class, 'edit'])->name('songs.edit');
    Route::put('/player/{song}', [SongController::class, 'update'])->name('songs.update');
    Route::delete('/player/{song}', [SongController::class, 'destroy'])->name('songs.destroy');

    Route::put('/player/playlists/{playlist}', [PlaylistController::class, 'update'])->name('playlists.update');
    Route::delete('/player/playlists/{playlist}', [PlaylistController::class, 'destroy'])->name('playlists.destroy');
    
    
    Route::get('/player/playlists', [PlaylistController::class, 'index'])->name('playlists.index');
    Route::post('/player/playlists', [PlaylistController::class, 'store'])->name('playlists.store');
    Route::post('/player/playlists/{playlist}/add-song', [PlaylistController::class, 'addSong'])->name('playlists.addSong');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
