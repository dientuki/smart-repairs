<?php

namespace App\Filament\Team\Resources\ServiceJobResource\Pages;

use App\Filament\Team\Resources\ServiceJobResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListServiceJobs extends ListRecords
{
    protected static string $resource = ServiceJobResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
