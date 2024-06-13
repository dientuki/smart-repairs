<?php

namespace App\Models;

use App\Enum\OrderStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends ModelWithTeam
{
    use HasFactory;

    protected $fillable = ['customer_id', 'team_id', 'user_id', 'device_unit_id', 'observation'];

    protected $casts = [
        'was_edited' => 0,
    ];

    public function customer():BelongsTo {
        return $this->belongsTo(Customer::class);
    }

    public function device_unit():BelongsTo {
        return $this->belongsTo(DeviceUnit::class);
    }

    public function comments(): HasMany {
        return $this->hasMany(OrderComment::class)->orderBy('created_at', 'asc');
    }

    public function getActiveOrders() {
        $team = auth()->user()->teams;

        $teamIds = [];
        foreach ($team as $t) {
            $teamIds[] = $t->id;
        }

        return self::whereIn('team_id', $teamIds)->where('status', '!=', 'ready')->get();
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
