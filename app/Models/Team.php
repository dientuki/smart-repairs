<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Team extends ModelAuditable
{
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * Retrieve the members of the team.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function members() {
        return $this->belongsToMany(User::class, 'team_user', 'user_id');
    }

    /**
     * Retrieve the customers associated with the team.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function customers() {
        return $this->hasMany(Customer::class);
    }


}
