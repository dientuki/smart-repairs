<?php

namespace App\Models;

class DeviceVersionPart extends ModelAuditable
{
    protected $fillable = ['device_version_id', 'part_id'];

    public function deviceVersion()
    {
        return $this->belongsTo(DeviceVersion::class);
    }

    public function part()
    {
        return $this->belongsTo(Part::class);
    }
}
