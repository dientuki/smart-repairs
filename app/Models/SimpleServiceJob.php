<?php

namespace App\Models;


class SimpleServiceJob extends ModelWithTeam
{
    protected $fillable = ['name', 'price', 'team_id'];
}
