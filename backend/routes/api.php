<?php
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [UserController::class, 'logout']);

    Route::middleware(['role:admin,customer'])->group(function () {
        Route::get('/items', [ItemController::class, 'index']);
        Route::get('/items/{item}', [ItemController::class, 'show']);
    });

    Route::middleware(['role:admin'])->group(function () {
        Route::post('/items', [ItemController::class, 'store']);
        Route::put('/items/{item}', [ItemController::class, 'update']);
        Route::delete('/items/{item}', [ItemController::class, 'destroy']);
        Route::get('/orders', [OrderController::class, 'index']);
    });

    Route::middleware(['role:customer'])->group(function () {
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders/user', [OrderController::class, 'show']);
        Route::apiResource("carts", CartController::class);
    });
});