<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = ['user_id', 'item_id', 'quantity', 'order_id'];

    protected $casts = [
        'user_id' => 'integer',
        'item_id' => 'integer',
        'quantity' => 'integer',
        'order_id' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}