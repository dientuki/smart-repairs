<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceAttachment extends ModelAuditable
{
    protected $fillable = [ 'name', 'file', 'device_id' ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}
