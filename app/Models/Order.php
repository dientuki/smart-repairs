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
        return $this->hasMany(OrderComment::class)->orderBy('created_at', 'asc');
    }

    public function getActiveOrders() {
        return self::where('status', '!=', 'ready')->get();
    }

    /**
     * Updates the status of an order.
     *
     * @param int $orderId The ID of the order.
     * @param string $status The new status of the order.
     * @return bool Returns true if the status was successfully updated, false otherwise.
     */
    public static function updateStatus(string $orderId, string $status): bool {
        if (OrderStatusEnum::isValid($status)) {
            $order = self::find($orderId);
            $order->status = $status;
            return $order->save();
        }
        return false;
    }
}
