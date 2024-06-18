<?php

namespace App\Models;

class OrderCheck extends ModelWithTeam
{
    protected $fillable = [
        'order_id',
        'damages',
        'damages_description',
        'features',
        'features_description'
    ];
}
