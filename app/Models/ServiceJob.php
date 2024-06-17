<?php

namespace App\Models;

class ServiceJob extends ModelWithTeam
{
    protected $fillable = ['name', 'price', 'team_id'];
}
