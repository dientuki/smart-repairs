<?php

namespace Tests\Unit\GraphQL;

interface RequiresAuthenticationInterface
{
    public function user_not_authenticated_cannot_access();

}