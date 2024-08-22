<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceUnit extends ModelWithTeam
{
    protected $fillable = ['device_id', 'serial', 'unlock_type', 'unlock_code', 'team_id'];

    /*
    public function device(): BelongsTo
    {
        return $this->belongsTo(DeviceVersion::class);
    }
        */

    public function deviceVersion(): BelongsTo
    {
        return $this->belongsTo(DeviceVersion::class);
    }

    public function label(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->serial
        );
    }
}
