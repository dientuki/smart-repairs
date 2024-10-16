<?php

namespace App\Models;

use App\Traits\HasTeamTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Customer extends ModelAuditable
{
    use HasTeamTrait;

    protected $fillable = ['first_name', 'last_name', 'phone', 'email', 'team_id'];

    /**
     * Returns an Attribute object that represents the full name of a customer.
     *
     * @return Attribute The Attribute object containing the full name.
     */
    public function label(): Attribute
    {
        return $this->fullNameAttribute();
    }

    /**
     * Returns an Attribute object that represents the full name of a customer.
     *
     * @return Attribute The Attribute object containing the full name.
     */
    public function fullname(): Attribute
    {
        return $this->fullNameAttribute();
    }

    /**
     * Returns an Attribute object that represents the full name of a customer.
     *
     * @return Attribute The Attribute object containing the full name.
     */
    private function fullNameAttribute(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => "{$attributes['first_name']} {$attributes['last_name']}",
        );
    }
}
