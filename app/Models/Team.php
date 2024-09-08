<?php

namespace App\Models;

use App\Models\Admin\Package;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Team extends ModelAuditable
{
    protected $fillable = ['name'];

    /**
     * Retrieve the members of the team.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_user', 'user_id');
    }

    /**
     * Retrieve the customers associated with the team.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    /*
    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }
    */

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public static function hasAccessToResource(Team $team, string $resourceName): bool
    {
        return $team->package->resources()->where('resources.resource', $resourceName)->exists();
    }
}
