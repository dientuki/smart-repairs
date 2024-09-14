<?php

namespace App\GraphQL\Queries;

use App\Traits\UserDataTrait;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class UserQueries
{
    use UserDataTrait;
    public function getCurrentUser(null $root, array $args, GraphQLContext $context): mixed
    {
        return [
            'id' => $this->getUserId(),
            'name' => $this->getUserName(),
            'imageUrl' => $this->getUserImageUrl(),
            'package' => $this->getTeamPackage(),
        ];
    }
}