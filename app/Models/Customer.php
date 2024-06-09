<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends ModelWithTeam
{
    use HasFactory;

    protected $fillable = ['first_name', 'last_name', 'phone', 'email', 'team_id'];

    public static function getCustomers($teamId)
    {
        //dd($teamId);
        return self::where('team_id', '01HZRBD546A6AE8CP91AEP1N64')->get();
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
