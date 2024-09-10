<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Device extends ModelAuditable
{
    protected $fillable = ['commercial_name', 'url', 'brand_id', 'device_type_id'];

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

    public function versions()
    {
        return $this->hasMany(DeviceVersion::class);
    }

    public function label(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->commercial_name
        );
    }

    public function parts()
    {
        return $this
            ->hasMany(DeviceVersion::class)
            ->join('device_versions_part', 'parts.id', '=', 'device_versions_part.part_id')
            ->join('device_versions', 'device_versions.id', '=', 'device_versions_part.device_version_id')
            ->join('module_categories', 'module_categories.id', '=', 'parts.module_category_id')
            ->from('parts')
            ->select('parts.*', 'device_versions.version as version', 'module_categories.name as category');
    }
}
