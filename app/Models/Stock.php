<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends ModelWithTeam
{
    protected $fillable = ['part_id', 'team_id', 'quantity', 'warning'];

    public function part(): BelongsTo
    {
        return $this->belongsTo(Part::class);
    }
}
