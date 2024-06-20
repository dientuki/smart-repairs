<?php

namespace App\Models;

use App\Traits\HasImageTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeviceType extends ModelAuditable
{
    use HasImageTrait;

    protected string $imageField = 'hash_filename';

    protected $fillable = [
        'name',
        'hash_filename',
    ];

    public function device_type_check(): HasMany
    {
        return $this->hasMany(DeviceTypeCheck::class);
    }

    public function label(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->name
        );
    }
}
