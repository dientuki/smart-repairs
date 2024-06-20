<?php

namespace App\Models;

class DeviceUnit extends ModelWithTeam
{
    protected $fillable = ['device_id', 'serial', 'unlock_type', 'unlock_code', 'team_id'];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}
