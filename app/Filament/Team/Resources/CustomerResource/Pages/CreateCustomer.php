<?php

namespace App\Filament\Team\Resources\CustomerResource\Pages;

use App\Filament\Team\Resources\CustomerResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateCustomer extends CreateRecord
{
    protected static string $resource = CustomerResource::class;
}
