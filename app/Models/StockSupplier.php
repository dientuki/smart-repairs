<?php

namespace App\Models;

use Filament\Facades\Filament;

class StockSupplier extends ModelWithTeam
{
    protected $fillable = [
        'stock_id',
        'supplier_id',
        'team_id',
    ];
}
