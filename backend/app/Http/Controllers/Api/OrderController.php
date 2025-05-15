<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(['user', 'carts.item'])->get();

        $data = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'date' => $order->date,
                'user' => [
                    'id' => $order->user->id,
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                ],
                'items' => $order->carts->map(function ($cart) {
                    return [
                        'id' => $cart->item->id,
                        'name' => $cart->item->name,
                        'description' => $cart->item->description,
                        'price' => $cart->item->price,
                        'stock' => $cart->item->stock,
                        'quantity' => $cart->quantity,
                        'image_url' => asset('storage/images/' . $cart->item->image),
                    ];
                }),
            ];
        });

        return response()->json([
            'orders' => $data
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'cart_ids' => 'required|array',
            'cart_ids.*' => 'exists:carts,id',
        ]);

        $user = auth()->user();
        $cartIds = $request->cart_ids;

        $carts = Cart::with('item')
            ->whereIn('id', $cartIds)
            ->where('user_id', $user->id)
            ->whereNull('order_id')
            ->get();

        if ($carts->count() !== count($cartIds)) {
            return response()->json([
                'message' => 'Some cart items are invalid or already checked out.'
            ], 400);
        }
        try {
            foreach ($carts as $cart) {
                if ($cart->quantity > $cart->item->stock) {
                    return response()->json([
                        'message' => "Insufficient stock for item: {$cart->item->name}"
                    ], 400);
                }
            }

            $order = Order::create([
                'date' => now()->format('F j, Y'),
                'user_id' => $user->id,
            ]);

            foreach ($carts as $cart) {
                $item = $cart->item;
                $item->stock -= $cart->quantity;
                $item->save();

                $cart->order_id = $order->id;
                $cart->save();
            }

            return response()->json([
                'message' => 'Order created successfully.',
                'order' => $order
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Order creation failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $user = auth()->user();

        $orders = Order::with(['carts.item'])
            ->where('user_id', $user->id)
            ->get();

        $data = $orders->map(function ($order) use ($user) {
            return [
                'id' => $order->id,
                'date' => $order->date,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'items' => $order->carts->map(function ($cart) {
                    return [
                        'id' => $cart->item->id,
                        'name' => $cart->item->name,
                        'description' => $cart->item->description,
                        'price' => $cart->item->price,
                        'stock' => $cart->item->stock,
                        'quantity' => $cart->quantity,
                        'image_url' => asset('storage/images/' . $cart->item->image),
                    ];
                }),
            ];
        });

        return response()->json([
            'orders' => $data
        ], 200);
    }

}