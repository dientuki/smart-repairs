<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderPayment extends ModelAuditable
{

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
