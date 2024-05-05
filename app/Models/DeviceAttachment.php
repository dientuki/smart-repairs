<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeviceAttachment extends Model
{
    use HasFactory;

    protected $fillable = [ 'name', 'file', 'device_id' ];

    public function device() {
        return $this->belongsTo(Device::class);
    }    
}
