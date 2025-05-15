<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Item;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'password' => bcrypt('password'),
            'role' => 'customer',
        ]);

        Item::create([
            'name' => 'Jenga',
            'description' => "Test your friendships and gravity's patience as you strategically remove wooden blocks from a teetering tower of impending doom!",
            'price' => 700,
            'stock' => 50,
            'image' => '1.jpg',
        ]);

        Item::create([
            'name' => 'Uno',
            'description' => "Shatter alliances and unleash your inner color-coordinated chaos in this ruthless card game where friendship is just a +4 away from oblivion.",
            'price' => 300,
            'stock' => 24,
            'image' => '2.jpg',
        ]);

        Item::create([
            'name' => 'Monopoly',
            'description' => "Bankrupt your loved ones, dominate the real estate market, and discover who among you is the most ruthless capitalist... all in good fun, of course!",
            'price' => 500,
            'stock' => 31,
            'image' => '3.jpg',
        ]);

        Item::create([
            'name' => 'Cluedo',
            'description' => "Become a detective, unravel a murderous mystery, and accuse your friends of being the culprit in this classic whodunit of cunning and deduction.",
            'price' => 1200,
            'stock' => 25,
            'image' => '4.jpg',
        ]);

        Item::create([
            'name' => 'What do you meme?',
            'description' => "Unleash your inner meme lord and compete to create the most hilariously inappropriate caption combinations that will leave everyone in stitches (or slightly offended)!",
            'price' => 600,
            'stock' => 12,
            'image' => '5.jpg',
        ]);
    }
}