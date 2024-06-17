<?php

namespace App\Models;

class PartAttachment extends ModelAuditable
{
    protected $fillable = [ 'name', 'hash_filename', 'original_filename', 'part_id' ];

    public function part() {
        return $this->belongsTo(Part::class);
    }
}
