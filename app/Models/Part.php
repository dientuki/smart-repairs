<?php

namespace App\Models;

use App\Traits\HasImageTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Part extends ModelAuditable
{
    use HasImageTrait;

    protected $fillable = [
        'observations',
        'part_number',
        'module_category_id',
        'brand_id',
        'screen_printing',
        'hash_filename'
    ];

    /**
     * Returns the brand that the part belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Returns the attachments associated with the part.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(PartAttachment::class);
    }

    /**
     * Returns the module category that the part belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function moduleCategory(): BelongsTo
    {
        return $this->belongsTo(ModuleCategory::class);
    }

    public function label(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->moduleCategory->name . ' ' . $this->brand->name . ' ' . $this->part_number
        );
    }

    public function deviceVersions()
    {
        return $this->belongsToMany(DeviceVersion::class, 'device_versions_part');
    }

    public function deviceVersionParts()
    {
        return $this->hasMany(DeviceVersionPart::class);
    }

    public function stock()
    {
        return $this->hasMany(Stock::class);
    }

    public function stockForTeam($teamId)
    {
        return $this->stock()->where('team_id', $teamId)->first();
    }

    public function budgetItems()
    {
        return $this->morphMany(BudgetItem::class, 'itemable');
    }
}
