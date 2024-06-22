<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartAttachment extends ModelAuditable
{
    protected $fillable = [ 'name', 'hash_filename', 'original_filename', 'part_id' ];

    public function part(): BelongsTo
    {
        return $this->belongsTo(Part::class);
    }
}
