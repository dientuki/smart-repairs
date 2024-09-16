<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\OrderComment;
use App\Traits\UserDataTrait;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class OrderCommentMutation
{
    use UserDataTrait;

    private function isMyComment(string $commentId): bool
    {
        $user = $this->getUserId();
        $comment = OrderComment::find($commentId);

        return $user && $user->id === $comment->user_id;
    }

    public function update(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        if ($this->isMyComment($args['commentId'])) {
            return OrderComment::where('id', $args['commentId'])->update($args['comment']);
        }

        return false;
    }

    public function delete(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        if ($this->isMyComment($args['commentId'])) {
            return OrderComment::destroy($args['commentId']);
        }

        return false;
    }

    public function create(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        $team_id = $this->getTeamId();

        return OrderComment::create([
            'order_id' => $args['orderId'],
            'team_id' => $team_id,
            'comment' => strip_tags($args['comment']['comment']),
            'user_id' => $this->getUserId(),
            'is_public' => $args['comment']['ispublic'],
        ]);
    }
}
