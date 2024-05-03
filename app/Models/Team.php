<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * Retrieve the members of the team.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function members() {
        return $this->belongsToMany(User::class, 'team_user', 'team_id', 'user_id');
    }

    /**
     * Retrieve the clients associated with the team.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */ 
    public function clients() {
        return $this->hasMany(Client::class);
    }


}
