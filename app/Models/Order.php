<?php

namespace App\Models;

use App\Enum\OrderStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends ModelWithTeam
{
    use HasFactory;

    protected $fillable = ['status', 'customer_id', 'team_id'];

    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    public function device_unit() {
        return $this->hasOne(DeviceUnit::class , 'order_id');
    }
}
