<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Customer;
use App\Traits\TeamContextTrait;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class CustomerQueries
{
    use TeamContextTrait;

    public function getCustomers(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamIdFromContext($context);

        return Customer::where('team_id', $team_id)->get();
    }
}
