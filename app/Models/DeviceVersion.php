<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class DeviceVersion extends ModelAuditable
{
    protected $fillable = [
        'version',
        'description',
        'device_id',
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function parts()
    {
        return $this->belongsToMany(Part::class, 'device_versions_parts', 'device_version_id', 'part_id');
    }
}
