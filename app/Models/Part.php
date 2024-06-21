<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

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

    public function optionLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->moduleCategory->name . ' ' . $this->brand->name . ' ' . $this->part_number
        );
    }
}
