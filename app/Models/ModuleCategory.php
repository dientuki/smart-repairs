<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ModuleCategory extends ModelAuditable
{
    use HasFactory;

    protected $fillable = ['name'];
}
