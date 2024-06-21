<?php

namespace App\Models;

class Device extends ModelAuditable
{
    protected $fillable = ['commercial_name', 'url', 'tech_name', 'brand_id', 'device_type_id'];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function deviceType()
    {
        return $this->belongsTo(DeviceType::class);
    }

    public function attachments()
    {
        return $this->hasMany(DeviceAttachment::class);
    }

    public function parts()
    {
        return $this->belongsToMany(Part::class, 'device_parts');
    }
}
