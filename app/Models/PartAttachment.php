<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartAttachment extends Model
{
    use HasFactory;

    protected $fillable = [ 'name', 'file', 'part_id' ];

    public function part() {
        return $this->belongsTo(Part::class);
    }
}
