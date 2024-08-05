<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderAttachments extends ModelWithTeam
{
    protected $fillable = [
        'order_id',
        'hash_filename',
        'team_id',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
