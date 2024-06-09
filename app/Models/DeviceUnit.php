<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeviceUnit extends ModelWithTeam
{
    use HasFactory;

    protected $fillable = ['device_id', 'serial', 'unlock_type', 'unlock_code', 'team_id'];

    public function device() {
        return $this->belongsTo(Device::class);
    }

    public static function getDeviceUnitsByTenant($tenant)
    {
        return static::where('team_id', '01HZRBD546A6AE8CP91AEP1N64')->get();
    }
}
