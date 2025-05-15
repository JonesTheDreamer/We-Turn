<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'image',
    ];

    protected $casts = [
        'price' => 'double',
        'stock' => 'integer',
    ];

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }
}