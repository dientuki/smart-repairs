<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;
    protected $fillable = ['commercial_name', 'url', 'tech_name', 'brand_id', 'device_type_id'];

    public function brand() {
        return $this->belongsTo(Brand::class);
    }

    public function device_type() {
        return $this->belongsTo(DeviceType::class);
    }

    public function attachments() {
        return $this->hasMany(DeviceAttachment::class);
    }    
}
