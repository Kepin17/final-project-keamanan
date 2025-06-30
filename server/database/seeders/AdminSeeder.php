<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'], // agar tidak ganda
            [
                'name' => 'Super Admin',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
                'phone' => '08123456789',
                'department' => 'Admin'
            ]
        );
    }
}
