<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

class Customer extends ModelWithTeam
{
    protected $fillable = ['first_name', 'last_name', 'phone', 'email', 'team_id'];

    public static function getCustomers()
    {
        return self::where('team_id', auth()->user()->teams->first()->id)->get();
    }

    /**
     * Returns an Attribute object that represents the full name of a customer.
     *
     * @return Attribute The Attribute object containing the full name.
     */
    public function fullName(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => "{$attributes['first_name']} {$attributes['last_name']}",
        );
    }
}
