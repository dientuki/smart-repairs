<?php

namespace App\Filament\Team\Resources\DeviceTypeResource\Pages;

use App\Filament\Team\Resources\DeviceTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListDeviceTypes extends ListRecords
{
    protected static string $resource = DeviceTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
