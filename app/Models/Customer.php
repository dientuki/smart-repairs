<?php

namespace App\Models;

use Filament\Facades\Filament;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends ModelWithTeam
{
    use HasFactory;

    protected $fillable = ['first_name', 'last_name', 'phone', 'email', 'team_id'];

}
