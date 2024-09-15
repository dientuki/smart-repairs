<?php

namespace Tests\Unit\GraphQL;

interface RequiresAuthenticationTest
{
    public function user_not_authenticated_cannot_access();
}
