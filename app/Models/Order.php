<?php

namespace App\Models;

use App\Enum\OrderStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends ModelWithTeam
{
    use HasFactory;

    protected $fillable = ['status', 'device_id', 'customer_id', 'team_id'];

    protected $casts = [
        'status' => OrderStatusEnum::class
    ];

    protected $attributes = [
        'status' => OrderStatusEnum::TOBUDGE,
    ];

    public function device() {
        return $this->belongsTo(Device::class);
    }

    public function customer() {
        return $this->belongsTo(Customer::class);
    }
}
