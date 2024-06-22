<?php

namespace App\Models;

use App\Traits\HasImageTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Brand extends ModelAuditable
{
    use HasImageTrait;

    protected $fillable = [
        'name',
        'hash_filename',
    ];

    public function label(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->name
        );
    }
}
