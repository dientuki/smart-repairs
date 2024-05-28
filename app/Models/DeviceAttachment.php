<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeviceAttachment extends ModelAuditable
{
    use HasFactory;

    protected $fillable = [ 'name', 'file', 'device_id' ];

    public function device() {
        return $this->belongsTo(Device::class);
    }
}
