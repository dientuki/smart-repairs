<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ServiceJob extends ModelWithTeam
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'team_id'];
}
