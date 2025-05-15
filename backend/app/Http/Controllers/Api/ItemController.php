<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Cart;
use App\Http\Requests\StoreItemRequest;
use Illuminate\Support\Str;


class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Item::all();

        $items->transform(function ($item) {
            $item->image_url = asset('storage/images/' . $item->image);
            return $item;
        });

        return response()->json($items, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemRequest $request)
    {
        $item = Item::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'image' => $request->image
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = $item->id . '.' . $image->getClientOriginalExtension();
            $image->storeAs('images', $filename, 'public');
            $item->image = $filename;
            $item->save();
        }

        $item->image_url = asset('storage/images/' . $item->image);

        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        $item->image_url = asset('storage/images/' . $item->image);
        return response()->json($item, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0.01',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:5000',
        ]);

        $item->update($request->except('image'));

        if ($request->hasFile('image')) {

            Storage::disk('public')->delete('images' . $item->image);

            $image = $request->file('image');
            $filename = $item->id . '.' . $image->getClientOriginalExtension();
            $image->storeAs('images', $filename, 'public');
            $item->image = $filename;
            $item->save();
        }

        $item->image_url = asset('storage/images/' . $item->image);

        return response()->json($item, 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        $isUsed = Cart::where('item_id', $item->id)
            ->whereNotNull('order_id')
            ->exists();

        if ($isUsed) {
            return response()->json([
                'message' => 'Cannot delete item. A customer ordered the item already.'
            ], 400);
        }

        Storage::disk('public')->delete('images/' . $item->image);

        $item->delete();

        return response()->json(['message' => 'Item deleted successfully.'], 200);
    }
}