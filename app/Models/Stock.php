<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Stock extends ModelWithTeam
{
    protected $fillable = ['part_id', 'team_id', 'quantity', 'warning'];

    public function part(): BelongsTo
    {
        return $this->belongsTo(Part::class);
    }

    public function devices(): BelongsToMany
    {
        return $this->part->devices();
    }
}
