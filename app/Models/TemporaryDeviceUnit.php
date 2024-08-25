<?php

namespace App\Models;

use App\Traits\RemoveEmptyStringsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemporaryDeviceUnit extends Model
{
    use HasUlids;
    use RemoveEmptyStringsTrait;

    protected $fillable = [
        'order_id',
        'device_id',
        'device_version_id',
        'device_unit_id',
        'serial',
        'unlock_type',
        'unlock_code'
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function deviceVersion(): BelongsTo
    {
        return $this->belongsTo(DeviceVersion::class);
    }
}
