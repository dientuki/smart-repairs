<?php

namespace App\Models;

use App\Traits\HasTeamTrait;

class SimpleServiceJob extends ModelAuditable
{
    use HasTeamTrait;

    protected $fillable = ['name', 'price', 'team_id'];
}
