<?php

namespace App\Models;

use App\Enum\OrderStatusEnum;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends ModelWithTeam
{
    protected $fillable = [
        'customer_id',
        'team_id',
        'user_id',
        'device_unit_id',
        'device_id',
        'diagnosis',
        'observation'
    ];

    protected $casts = [
        'was_edited' => 0,
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function deviceUnit(): BelongsTo
    {
        return $this->belongsTo(DeviceUnit::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(OrderComment::class)->orderBy('created_at', 'asc');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function budget(): HasOne
    {
        return $this->hasOne(Budget::class);
    }

    /**
     * Updates the status of an order.
     *
     * @param string $orderId The ID of the order.
     * @param string $status The new status of the order.
     * @return bool Returns true if the status was successfully updated, false otherwise.
     */
    public static function updateStatus(string $orderId, string $status): bool
    {
        if (OrderStatusEnum::isValid($status)) {
            $order = self::find($orderId);
            $order->status = $status;
            return $order->save();
        }
        return false;
    }

    public function hasBudget(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->budget()->exists()
        );
    }
}
