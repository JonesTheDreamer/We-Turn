<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'date',
        'user_id',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'date' => 'string', // Stored in "January 1, 2021" format
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }
}