<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cookie;

Route::get('/', function () {
    return view('welcome');
});

Route::domain('team.localhost')->group(function () {
    Route::group(['middleware' => 'auth'], function () {
        Route::get('/board/', function () {
            Cookie::queue('team_id', auth()->user()->teams->first()->id);
            return view('board');
        });
    });

    Auth::routes();
});