<?php

namespace App\Models;

use App\Enum\OrderStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['status', 'device_id', 'client_id'];

    protected $casts = [
        'status' => OrderStatusEnum::class
    ];

    /**
     * Method to define the relationship with the Team model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function team() {
        return $this->belongsTo(Team::class);
    }    

    public function device() {
        return $this->belongsTo(Device::class);
    }    

    public function client() {
        return $this->belongsTo(Client::class);
    }    
}
