<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class PartAttachment extends ModelAuditable
{
    use HasFactory;

    protected $fillable = [ 'name', 'hash_filename', 'original_filename', 'part_id' ];

    public function part() {
        return $this->belongsTo(Part::class);
    }
}
