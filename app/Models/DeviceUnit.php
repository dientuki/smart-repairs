<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceUnit extends ModelWithTeam
{
    protected $fillable = ['device_id', 'serial', 'unlock_type', 'unlock_code', 'team_id'];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}
