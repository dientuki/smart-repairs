<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Customer;

final readonly class CustomerQueries
{

    public static function getCustomers()
    {
        return Customer::where('team_id', auth()->user()->teams->first()->id)->get();
    }
}
