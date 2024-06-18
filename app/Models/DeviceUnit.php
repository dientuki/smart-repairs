<?php

namespace App\Models;

class DeviceUnit extends ModelWithTeam
{
    protected $fillable = ['device_id', 'serial', 'unlock_type', 'unlock_code', 'team_id'];

    public function device() {
        return $this->belongsTo(Device::class);
    }

    public static function getDeviceUnitsByTeam()
    {
        return static::where('team_id', auth()->user()->teams->first()->id)->get();
    }
}
