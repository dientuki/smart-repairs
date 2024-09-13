<?php

namespace App\Models;

use App\Traits\HasTeamTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceUnit extends ModelAuditable
{
    use HasTeamTrait;

    protected $fillable = ['device_id', 'serial', 'unlock_type', 'unlock_code', 'team_id', 'device_version_id'];

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
