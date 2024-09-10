<?php

namespace App\Models;

use App\Traits\HasImageTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Brand extends ModelAuditable
{
    use HasImageTrait;

    protected $fillable = [
        'name',
        'hash_filename',
    ];

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class);
    }

    public function parts(): HasMany
    {
        return $this->hasMany(Part::class);
    }

    public function label(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->name
        );
    }
}
