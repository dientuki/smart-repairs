<?php

namespace App\Models;

use App\Enum\OrderStatusEnum;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function comments(): HasMany {
        return $this->hasMany(OrderComment::class);
    }

    public function observation(): Attribute {
        return Attribute::make(
            get: fn ($value, $attributes) => $this->hasOne(OrderComment::class)->limit(1)->value('comment'),
        );
    }

    public function getActiveOrders() {
        return self::where('status', '!=', 'ready')->get();
    }
}
