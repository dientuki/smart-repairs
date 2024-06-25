<?php

namespace App\Models;

use Database\Seeders\DevicePartSeeder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

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

    public function parts()
    {
        return $this
            ->hasMany(DeviceVersion::class)
            ->join('device_versions_parts', 'parts.id', '=', 'device_versions_parts.part_id')
            ->join('device_versions', 'device_versions.id', '=', 'device_versions_parts.device_version_id')
            ->join('module_categories', 'module_categories.id', '=', 'parts.module_category_id')
            ->from('parts')
            ->select('parts.*', 'device_versions.version as version', 'module_categories.name as category');
    }
}
