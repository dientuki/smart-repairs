<?php

namespace App\Filament\Team\Resources\StockResource\Pages;

use App\Filament\Team\Resources\StockResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateStock extends CreateRecord
{
    protected static string $resource = StockResource::class;
}
