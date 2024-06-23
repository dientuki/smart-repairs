<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class DeviceVersion extends ModelAuditable
{
    protected $fillable = [
        'version',
        'description',
        'device_id',
    ];

    // Define the relationship to DevicePart
    public function deviceParts()
    {
        return $this->hasMany(DevicePart::class, 'device_version_id');
    }

    // Define the relationship to Device
    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }

    /*
    public function parts(): BelongsToMany
    {
        return $this->belongsToMany(Part::class, 'device_parts');
    }

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
        */
}
