<?php

namespace App\Models;

class Supplier extends ModelWithTeam
{
    protected $fillable = ['name', 'address', 'phone', 'email', 'website', 'team_id'];
}
