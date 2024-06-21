<?php

namespace App\Models;

class Part extends ModelAuditable
{
    protected $fillable = ['observations', 'part_number', 'module_category_id', 'brand_id'];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function attachments()
    {
        return $this->hasMany(PartAttachment::class);
    }

    public function devices()
    {
        return $this->belongsToMany(Device::class, 'device_parts');
    }

    public function moduleCategory()
    {
        return $this->belongsTo(ModuleCategory::class);
    }
}
