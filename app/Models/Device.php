<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Device extends ModelAuditable
{
    protected $fillable = ['commercial_name', 'url', 'tech_name', 'brand_id', 'device_type_id'];

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function deviceType(): BelongsTo
    {
        return $this->belongsTo(DeviceType::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(DeviceAttachment::class);
    }

    public function parts(): BelongsToMany
    {
        return $this->belongsToMany(Part::class, 'device_parts');
    }
}
