<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Item;
use App\Http\Requests\StoreCartRequest;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();

        $carts = Cart::with('item')
            ->where('user_id', $userId)
            ->whereNull('order_id')
            ->get()
            ->map(function ($cart) {
                return [
                    'id' => $cart->id,
                    'order_id' => $cart->order_id,
                    'quantity' => $cart->quantity,
                    'item' => $cart->item,
                    'image_url' => asset('storage/images/' . $cart->item->image)
                ];
            });

        return response()->json(['carts' => $carts]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCartRequest $request)
    {
        $userId = Auth::id();
        $itemId = $request->item_id;
        $quantity = $request->quantity;

        $existingCart = Cart::where('user_id', $userId)
            ->where('item_id', $itemId)
            ->whereNull('order_id')
            ->first();

        if ($existingCart) {
            $existingCart->quantity += $quantity;
            $existingCart->save();
            $cart = $existingCart;
        } else {
            $cart = Cart::create([
                'user_id' => $userId,
                'item_id' => $itemId,
                'quantity' => $quantity,
                'order_id' => null
            ]);
        }

        $cart->load('item');

        return response()->json([
            'cart' => $cart,
            'image_url' => asset('storage/images/' . $cart->item->image)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Cart $cart)
    {
        if ($cart->user_id !== auth()->id()) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        if ($cart->order_id !== null) {
            return response()->json(['message' => 'Cart item not available.'], 400);
        }

        $cart->load('item');

        return response()->json([
            'cart' => $cart,
            'image_url' => asset('storage/images/' . $cart->item->image)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cart $cart)
    {
        if ($cart->user_id !== auth()->id()) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        if ($cart->order_id !== null) {
            return response()->json(['message' => 'Cannot update cart that is already part of an order.'], 400);
        }

        $cart->quantity = $request->quantity;
        $cart->save();

        return response()->json(['message' => 'Cart updated successfully.'], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cart $cart)
    {
        if ($cart->user_id !== auth()->id()) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        if ($cart->order_id !== null) {
            return response()->json(['message' => 'Cannot delete cart item that is already part of an order.'], 400);
        }

        $cart->delete();

        return response()->json(['message' => 'Cart item deleted successfully.']);
    }
}