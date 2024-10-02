<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class DeviceVersion extends ModelAuditable
{
    protected $fillable = [
        'version',
        'description',
        'device_id',
    ];

    public function label(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->description
                ? "{$this->version} ({$this->description})"
                : $this->version
        );
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function devices(): BelongsToMany
    {
        return $this->belongsToMany(Device::class, 'device_versions_devices', 'device_version_id', 'device_id');
    }

    public function parts(): BelongsToMany
    {
        return $this->belongsToMany(Part::class, 'device_versions_part', 'device_version_id', 'part_id');
    }
}
