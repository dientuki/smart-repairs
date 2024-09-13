<?php

namespace App\Models;

use App\Traits\HasTeamTrait;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Stock extends  ModelAuditable
{
    use HasTeamTrait;

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
