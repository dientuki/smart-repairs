<?php

namespace App\Models;

use App\Enum\OrderStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends ModelWithTeam
{
    use HasFactory;

    protected $fillable = ['status', 'device_id', 'client_id'];

    protected $casts = [
        'status' => OrderStatusEnum::class
    ];

    public function device() {
        return $this->belongsTo(Device::class);
    }    

    public function client() {
        return $this->belongsTo(Client::class);
    }    
}
