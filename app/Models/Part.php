<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Part extends Model
{
    use HasFactory;

    protected $fillable = ['observations', 'part_number', 'module_category_id', 'brand_id'];

    public function brand() {
        return $this->belongsTo(Brand::class);
    }

    public function attachments() {
        return $this->hasMany(PartAttachment::class);
    }

    public function devices() {
        return $this->belongsToMany(Device::class, 'device_parts');
    }

    public function module_category() {
        return $this->belongsTo(ModuleCategory::class);
    }    
}
