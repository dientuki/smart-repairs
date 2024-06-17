<?php

namespace App\Models;

class DeviceAttachment extends ModelAuditable
{
    protected $fillable = [ 'name', 'file', 'device_id' ];

    public function device() {
        return $this->belongsTo(Device::class);
    }
}
