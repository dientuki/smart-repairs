<?php

namespace App\Models;

class StockSupplier extends ModelAuditable
{
    protected $fillable = [
        'stock_id',
        'supplier_id',
        'team_id',
    ];
}
