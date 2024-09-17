<?php

namespace App\Models;

use App\Traits\HasTeamTrait;

class OrderCheck extends ModelAuditable
{
    use HasTeamTrait;

    protected $fillable = [
        'order_id',
        'damages',
        'damages_description',
        'features',
        'features_description'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
