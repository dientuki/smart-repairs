<?php

namespace App\Models;

use App\Models\Admin\Subscription;
use App\Traits\HasImageTrait;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Team extends ModelAuditable
{
    use HasImageTrait;

    protected $fillable = [
        'name',
        'email',
        'phones',
        'address',
        'website',
        'hash_filename',
    ];

    protected function casts(): array
    {
        return [
            'phones' => 'array',
        ];
    }

    /**
     * Retrieve the members of the team.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_user', 'team_id', 'user_id');
    }

    /**
     * Retrieve the customers associated with the team.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function serviceJobs(): HasMany
    {
        return $this->hasMany(ServiceJob::class);
    }

    public function discounts(): HasMany
    {
        return $this->hasMany(Discount::class);
    }

    public function deviceTypeChecks(): HasMany
    {
        return $this->hasMany(DeviceTypeCheck::class);
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    public function supplier(): HasMany
    {
        return $this->hasMany(Supplier::class);
    }


    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'team_user');
    }

    public static function hasAccessToResource(Team $team, string $resourceName): bool
    {
        return $team->subscription->package->resources()->where('resources.resource', $resourceName)->exists();
    }
}
