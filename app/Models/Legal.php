<?php

namespace App\Models;

use App\Traits\HasTeamTrait;

class Legal extends ModelAuditable
{
    use HasTeamTrait;

    protected $fillable = [
        'content',
        'team_id'
    ];
}
