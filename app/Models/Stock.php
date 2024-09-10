<?php

namespace App\Models;

use Filament\Facades\Filament;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Stock extends ModelWithTeam
{
    protected $fillable = ['part_id', 'team_id', 'quantity', 'warning', 'price'];

    public function part(): BelongsTo
    {
        return $this->belongsTo(Part::class);
    }

    public function devicesVersions()
    {
        //return $this->belongsToMany(DeviceVersion::class, 'device_versions_part');
        //dd($this->part->deviceVersions()->toSql());
        return $this->part->deviceVersions();
    }

    public function suppliers(): BelongsToMany
    {
        return $this->BelongsToMany(Supplier::class, 'stock_supplier')->withPivot('price');
    }


    /*

    public function devices(): BelongsToMany
    {
        return $this->part->devices();
    }

    public function deviceVersions()
    {
        return $this->belongsToMany(DeviceVersion::class, 'device_versions_part');
    }
        */
}
